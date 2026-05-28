<script setup lang="ts">
import { computed } from 'vue'
import HomeEditorDemo from './HomeEditorDemo.vue'
import { homeContent, type HomeLocale } from './home-content'

const props = withDefaults(
  defineProps<{
    locale?: HomeLocale
  }>(),
  {
    locale: 'zh-CN'
  }
)

const normalizedLocale = computed<HomeLocale>(() => {
  return props.locale === 'en-US' ? 'en-US' : 'zh-CN'
})

const content = computed(() => homeContent[normalizedLocale.value])

const isExternalLink = (href: string) => /^https?:\/\//.test(href)
</script>

<template>
  <main class="landing-page">
    <section class="landing-hero">
      <p class="landing-eyebrow">{{ content.hero.eyebrow }}</p>
      <h1 class="landing-title">{{ content.hero.title }}</h1>
      <p class="landing-subtitle">{{ content.hero.subtitle }}</p>
      <div class="landing-cta">
        <a class="landing-btn landing-btn-primary" :href="content.hero.primaryCta.href">
          {{ content.hero.primaryCta.label }}
        </a>
        <a
          class="landing-btn landing-btn-secondary"
          :href="content.hero.secondaryCta.href"
          :target="isExternalLink(content.hero.secondaryCta.href) ? '_blank' : undefined"
          :rel="
            isExternalLink(content.hero.secondaryCta.href)
              ? 'noopener noreferrer'
              : undefined
          "
        >
          {{ content.hero.secondaryCta.label }}
        </a>
      </div>
    </section>

    <section class="landing-demo">
      <div class="landing-section-head">
        <h2>{{ content.demo.title }}</h2>
        <p>{{ content.demo.note }}</p>
      </div>
      <HomeEditorDemo />
    </section>

    <section class="landing-integrations">
      <div class="landing-section-head">
        <h2>{{ content.integrations.title }}</h2>
        <p>{{ content.integrations.subtitle }}</p>
      </div>
      <div class="landing-grid landing-grid-3">
        <article
          v-for="item in content.integrations.items"
          :key="item.title"
          class="landing-card"
        >
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>

    <section class="landing-comparison">
      <div class="landing-section-head">
        <h2>{{ content.comparison.title }}</h2>
        <p>{{ content.comparison.subtitle }}</p>
      </div>
      <div class="landing-comparison-table">
        <div class="landing-comparison-row landing-comparison-header">
          <strong>{{ content.comparison.headers.topic }}</strong>
          <strong>{{ content.comparison.headers.traditional }}</strong>
          <strong>{{ content.comparison.headers.lyEditor }}</strong>
        </div>
        <div
          v-for="row in content.comparison.rows"
          :key="row.topic"
          class="landing-comparison-row"
        >
          <span>{{ row.topic }}</span>
          <span class="landing-negative">{{ row.traditional }}</span>
          <span class="landing-positive">{{ row.lyEditor }}</span>
        </div>
      </div>
    </section>

    <section class="landing-capabilities">
      <div class="landing-section-head">
        <h2>{{ content.capabilities.title }}</h2>
        <p>{{ content.capabilities.subtitle }}</p>
      </div>
      <div class="landing-grid landing-grid-3">
        <a
          v-for="card in content.capabilities.cards"
          :key="card.title"
          :href="card.href"
          class="landing-card landing-card-link"
        >
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </a>
      </div>
    </section>
  </main>
</template>
