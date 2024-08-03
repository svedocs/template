import {
	defineConfig,
	transformerCompileClass,
	transformerDirectives,
	transformerVariantGroup,
	presetUno
} from 'unocss';

export default defineConfig({
	presets: [presetUno()],
	transformers: [transformerCompileClass(), transformerDirectives(), transformerVariantGroup()]
});
