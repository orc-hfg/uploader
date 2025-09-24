<script setup lang="ts">
	import Fade from '@/components/transitions/Fade.vue';

	const footerUIStore = useFooterUIStore();
	const { leftActionComponent, leftActionProps, rightActionComponent, rightActionProps } = storeToRefs(footerUIStore);

	const leftKey = computed(() => leftActionProps.value?.label ?? 'left-label');

	const rightKey = computed(() => rightActionProps.value?.label ?? 'right-label');

	function handleLeftClick(): void {
		if (leftActionProps.value?.click) {
			leftActionProps.value.click();
		}
	}

	function handleRightClick(): void {
		if (rightActionProps.value?.click) {
			rightActionProps.value.click();
		}
	}
</script>

<template>
	<div class="flex h-full items-center justify-between">
		<Fade>
			<div :key="leftKey">
				<component
					:is="leftActionComponent"
					v-if="leftActionComponent"
					v-bind="leftActionProps"
					@click="handleLeftClick"
				/>
			</div>
		</Fade>
		<Fade>
			<div :key="rightKey">
				<component
					:is="rightActionComponent"
					v-if="rightActionComponent"
					v-bind="rightActionProps"
					@click="handleRightClick"
				/>
			</div>
		</Fade>
	</div>
</template>
