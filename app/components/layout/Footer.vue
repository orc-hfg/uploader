<script setup lang="ts">
	import Fade from '@/components/transitions/Fade.vue';

	const footerUIStore = useFooterUIStore();
	const leftKey = computed(() => footerUIStore.leftActionProps?.label ?? 'left-label');
	const rightKey = computed(() => footerUIStore.rightActionProps?.label ?? 'right-label');

	function handleLeftActionClick(): void {
		const props = footerUIStore.leftActionProps;
		if (props && props.type === 'button') {
			props.click();
		}
	}

	function handleRightActionClick(): void {
		const props = footerUIStore.rightActionProps;
		if (props && props.type === 'button') {
			props.click();
		}
	}
</script>

<template>
	<div class="flex h-full items-center justify-between">
		<slot>
			<Fade>
				<div :key="leftKey">
					<component
						:is="footerUIStore.leftActionComponent"
						v-if="footerUIStore.leftActionComponent"
						v-bind="footerUIStore.leftActionProps"
						@click="handleLeftActionClick"
					/>
				</div>
			</Fade>
			<Fade>
				<div :key="rightKey">
					<component
						:is="footerUIStore.rightActionComponent"
						v-if="footerUIStore.rightActionComponent"
						v-bind="footerUIStore.rightActionProps"
						@click="handleRightActionClick"
					/>
				</div>
			</Fade>
		</slot>
	</div>
</template>
