<template>
	<NuxtRouteAnnouncer />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<style lang="css" scoped>
@keyframes slideInFromRight {
	from { transform: translateX(100%); }
	to { transform: translateX(0); }
}

@keyframes slideOutToRight {
	from { transform: translateX(0); }
	to { transform: translateX(100%); }
}

@keyframes slideInFromLeft {
	from { transform: translateX(-100%); }
	to { transform: translateX(0); }
}

@keyframes slideOutToLeft {
	from { transform: translateX(0); }
	to { transform: translateX(-100%); }
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
	position: absolute;
	width: 100%;
	will-change: transform;
	animation-duration: 0.5s;
	animation-fill-mode: forwards;
	animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1);
}

.slide-left-enter-active {
	animation-name: slideInFromRight;
}

.slide-left-leave-active {
	animation-name: slideOutToRight;
}

.slide-right-enter-active {
	animation-name: slideInFromLeft;
}

.slide-right-leave-active {
	animation-name: slideOutToLeft;
}
</style>
