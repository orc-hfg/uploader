<script setup lang="ts">
	import Fade from '@/components/transitions/Fade.vue';

	const fadeDuration = 1;

	const footerUIStore = useFooterUIStore();
	const { leftActionComponent, leftActionProps, rightActionComponent, rightActionProps } = storeToRefs(footerUIStore);

	const leftKey = computed(() => leftActionProps.value?.label ?? 'left-label');

	const rightKey = computed(() => rightActionProps.value?.label ?? 'right-label');
</script>

<template>
	<div class="flex h-full items-center justify-between">
		<Fade :duration="fadeDuration">
			<div :key="leftKey">
				<component
					:is="leftActionComponent"
					v-if="leftActionComponent"
					v-bind="leftActionProps"
				/>
			</div>
		</Fade>
		<Fade :duration="fadeDuration">
			<div :key="rightKey">
				<component
					:is="rightActionComponent"
					v-if="rightActionComponent"
					v-bind="rightActionProps"
				/>
			</div>
		</Fade>
	</div>
</template>
