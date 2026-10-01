default: reset build-dev dev

build:
    pnpm run build

build-dev:
    pnpm run build:dev

clean:
    pnpm run clean

clean-deep:
    pnpm run clean:deep

dev:
    pnpm run dev

serve-prod:
    pnpm run serve:prod

reset: clean-deep
    pnpm install

watch:
    pnpm run watch
