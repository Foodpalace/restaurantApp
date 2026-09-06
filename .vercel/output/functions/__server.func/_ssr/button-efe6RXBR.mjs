import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { s as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-efe6RXBR.js
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-[opacity,transform,background-color,color,border-color] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] focus-visible:outline-none min-h-10", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "bg-elevated text-fg border border-border hover:border-border-strong",
			ghost: "text-muted hover:text-fg hover:bg-elevated",
			danger: "bg-danger text-danger-fg hover:opacity-90",
			outline: "border border-border text-fg hover:bg-elevated"
		},
		size: {
			default: "h-10 px-4",
			sm: "h-8 min-h-8 px-3 text-xs",
			lg: "h-11 px-5",
			icon: "h-10 w-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
export { Button as t };
