<template>
	<NuxtRouteAnnouncer />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<style lang="css" scoped>
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

/* Same behavior, implemented as Transition */
/* .slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
	transition: transform 0.5s;
	position: absolute;
	width: 100%;
	will-change: transform;
}
.slide-left-enter-from {
	transform: translate(100%, 0);
}
.slide-left-leave-to {
	transform: translate(100%, 0);
}
.slide-right-enter-from {
	transform: translate(-100%, 0);
}
.slide-right-leave-to {
	transform: translate(-100%, 0);
} */
</style>
