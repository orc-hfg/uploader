<script setup lang="ts">
	import { useFooterUIStore } from '@/stores/footer-ui';
	import { storeToRefs } from 'pinia';
	import Fade from './transitions/Fade.vue';

	const fadeDuration = 1;

	const footerUIStore = useFooterUIStore();
	const { leftActionComponent, leftActionProps, rightActionComponent, rightActionProps } = storeToRefs(footerUIStore);

	const leftKey = computed(() => {
		return leftActionProps.value?.label ?? 'left-label';
	});

	const rightKey = computed(() => {
		return rightActionProps.value?.label ?? 'right-label';
	});
</script>

<template>
	<div class="flex justify-between">
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
