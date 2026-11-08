<template>
  <v-dialog :model-value="modelValue" max-width="760" scrollable :persistent="saving" @update:model-value="emit('update:modelValue', $event)">
    <v-card rounded="xl">
      <v-card-title class="d-flex align-center pa-5">
        <span class="font-display" style="color: var(--vio-purple)">{{ product ? "Edit product" : "Add product" }}</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" size="small" :disabled="saving" @click="emit('update:modelValue', false)" />
      </v-card-title>
      <v-divider />

      <v-card-text class="pa-5">
        <v-form ref="formRef" @submit.prevent="save">
          <v-row dense>
            <v-col cols="12" sm="8">
              <v-text-field v-model="form.name" label="Product name *" :rules="[required, maxLen(120)]" />
            </v-col>
            <v-col cols="12" sm="4">
              <v-switch v-model="form.visible" color="primary" inset hide-details :label="form.visible ? 'Visible in shop' : 'Hidden from shop'" />
            </v-col>
            <v-col cols="6" sm="4">
              <v-text-field v-model.number="form.price" type="number" min="1" step="1" label="Price (₦) *" prefix="₦" :rules="[required, positive]" />
            </v-col>
            <v-col cols="6" sm="4">
              <v-text-field v-model.number="form.stock" type="number" min="0" step="1" label="Stock *" :rules="[required, wholeNumber]" />
            </v-col>
            <v-col cols="12" sm="4">
              <v-select v-model="form.category" :items="PRODUCT_CATEGORIES" item-title="label" item-value="id" label="Category *" :rules="[required]" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select v-model="form.theme" :items="themeOptions" item-title="label" item-value="id" label="Occasion / theme *" :rules="[required]" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-combobox v-model="form.tags" :items="tagSuggestions" label="Tags" multiple chips closable-chips hint="e.g. Best Seller, New" persistent-hint />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="form.description" label="Description" rows="3" auto-grow counter="600" :rules="[maxLen(600)]" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-combobox v-model="form.items" label="What it contains" multiple chips closable-chips hint="Type an item and press Enter" persistent-hint />
            </v-col>
            <v-col cols="12" sm="6">
              <v-combobox v-model="form.perfectFor" label="Perfect for" multiple chips closable-chips hint="Type an occasion and press Enter" persistent-hint />
            </v-col>
          </v-row>

          <h4 class="font-display mt-6 mb-3" style="color: var(--vio-purple)">Photos</h4>
          <v-row dense>
            <v-col v-for="slot in imageSlots" :key="slot.key" cols="12" sm="6">
              <div class="image-slot mb-2">
                <v-img v-if="form[slot.key]" :src="form[slot.key]" cover aspect-ratio="1.33" />
                <div v-else class="d-flex align-center justify-center h-100 text-caption" style="color: var(--vio-text-muted)">No photo</div>
                <v-overlay :model-value="uploading === slot.key" contained class="align-center justify-center">
                  <v-progress-circular indeterminate color="white" />
                </v-overlay>
              </div>
              <div class="d-flex ga-2">
                <v-btn size="small" variant="tonal" color="primary" class="text-none" prepend-icon="mdi-upload" :disabled="!!uploading" @click="pickFile(slot.key)">
                  Upload {{ slot.label.toLowerCase() }}
                </v-btn>
                <v-btn v-if="form[slot.key]" size="small" variant="text" class="text-none" :disabled="!!uploading" @click="form[slot.key] = ''">Remove</v-btn>
              </div>
            </v-col>
          </v-row>
          <input ref="fileInput" type="file" accept="image/*" hidden @change="onFile" />
          <p class="text-caption mt-2" style="color: var(--vio-text-muted)">JPG, PNG or WebP, under 5 MB. The main photo is used on product cards.</p>

          <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mt-4">{{ error }}</v-alert>
        </v-form>
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" class="text-none" :disabled="saving" @click="emit('update:modelValue', false)">Cancel</v-btn>
        <v-btn color="primary" variant="flat" rounded="lg" class="text-none" :loading="saving" :disabled="!!uploading" @click="save">
          {{ product ? "Save changes" : "Add product" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { themeDisplayNames } from "@/data/products";
import { useProductsStore, PRODUCT_CATEGORIES } from "@/store/products";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // The product being edited, or null to add a new one.
  product: { type: Object, default: null },
});
const emit = defineEmits(["update:modelValue", "saved"]);

const productsStore = useProductsStore();
const themeOptions = Object.entries(themeDisplayNames).map(([id, label]) => ({ id, label }));
const tagSuggestions = ["Best Seller", "New", "Limited Edition", "Popular", "Trending", "Corporate", "Premium", "Special Occasion"];
const imageSlots = [
  { key: "image", label: "Main photo" },
  { key: "image2", label: "Second photo" },
];

const blank = () => ({
  name: "",
  price: null,
  stock: 0,
  category: "health",
  theme: "friendship",
  description: "",
  tags: [],
  items: [],
  perfectFor: [],
  image: "",
  image2: "",
  visible: true,
});

const form = reactive(blank());
const formRef = ref(null);
const fileInput = ref(null);
const pendingSlot = ref(null);
const uploading = ref(null);
const saving = ref(false);
const error = ref("");

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return;
    error.value = "";
    const p = props.product;
    Object.assign(form, blank(), p ? {
      name: p.name,
      price: p.price,
      stock: p.stock ?? 0,
      category: p.category,
      theme: p.theme,
      description: p.description || "",
      tags: [...(p.tags || [])],
      items: [...(p.items || [])],
      perfectFor: [...(p.perfectFor || [])],
      image: p.image || "",
      image2: p.image2 || "",
      visible: p.visible !== false,
    } : {});
  }
);

const required = (v) => (v !== null && v !== undefined && v !== "") || "Required";
const positive = (v) => Number(v) > 0 || "Must be more than 0";
const wholeNumber = (v) => (Number.isInteger(Number(v)) && Number(v) >= 0) || "Whole number, 0 or more";
const maxLen = (n) => (v) => !v || v.length <= n || `Max ${n} characters`;

function pickFile(slot) {
  pendingSlot.value = slot;
  fileInput.value.value = "";
  fileInput.value.click();
}

async function onFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    error.value = "Please choose an image file.";
    return;
  }
  if (file.size >= 5 * 1024 * 1024) {
    error.value = "That photo is over 5 MB. Please use a smaller one.";
    return;
  }
  const slot = pendingSlot.value;
  uploading.value = slot;
  error.value = "";
  try {
    form[slot] = await productsStore.uploadImage(file);
  } catch (err) {
    error.value = `Upload failed: ${err.message}`;
  } finally {
    uploading.value = null;
  }
}

async function save() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  if (!form.image) {
    error.value = "Add a main photo before saving.";
    return;
  }
  saving.value = true;
  error.value = "";
  const clean = (list) => [...new Set(list.map((s) => String(s).trim()).filter(Boolean))];
  try {
    const id = await productsStore.save(props.product?.id, {
      name: form.name.trim(),
      price: Number(form.price),
      stock: Math.floor(Number(form.stock)),
      category: form.category,
      theme: form.theme,
      description: form.description.trim(),
      tags: clean(form.tags),
      items: clean(form.items),
      perfectFor: clean(form.perfectFor),
      image: form.image,
      image2: form.image2 || "",
      visible: form.visible,
    });
    emit("saved", id);
    emit("update:modelValue", false);
  } catch (err) {
    error.value = `Could not save: ${err.message}`;
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.image-slot {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: 1px dashed rgba(143, 90, 168, 0.35);
  background: var(--vio-cream);
  aspect-ratio: 1.33;
}
</style>
