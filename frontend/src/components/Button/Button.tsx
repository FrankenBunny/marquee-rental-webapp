import './Button.css'

/**
 * Button Component
 *
 * A reusable button component supporting multiple styles.
 *
 * ## Props:
 *
 * @prop {string} label  
 * The text label displayed inside the button.
 *
 * @prop {"primary" | "warning"} variant
 * Visual variant of the button. Determines the color scheme:
 * - `"primary"`: White text on a blue background.
 * - `"warning"`: White text on a red background.
 *
 * @prop {boolean} [background]  
 * When `true`, applies a background color based on the variant.
 *
 * @prop {boolean} [outline]  
 * When `true`, renders the button with an outlined style (no background).
 *
 * @prop {() => void} [onClick]  
 * Callback function to be called when the button is clicked.
 *
 * ## Behavior:
 * - If both `background` and `outline` are `true`, `background` will be treated as true.
 * - If both `background` and `outline` are `true`, `background` takes precedence.
 * - (Future) When `icon` support is implemented, both `background` and `outline` may be set to `false`,
 *   and only the icon will be shown with styling determined by the variant.
 *
 * ## TODO:
 * - Support for `icon` (e.g., `icon?: boolean`)
 * - Allow custom icon source (e.g., `iconSrc?: string`)
 *
 * ## Example Usage:
 * ```tsx
 * <Button
 *   label="Submit"
 *   variant="primary"
 *   background={true}
 *   onClick={() => console.log("Clicked!")}
 * />
 * ```
 */

interface ButtonProps {
  onClick?: () => void;
  background?: boolean;
  outline?: boolean;
  // TODO: icon?: boolean;
  // TODO: icon-src: string(?);
  variant: "primary" | "warning";
  label: string;
}

function Button({ onClick, background, outline, variant, label }: ButtonProps) {
  var className = "reusable-button ";

  if (background) {
    className += variant + "-button";
  } else if (!background) {
    className += variant + "-button";
  } else if (outline) {
    className += variant + "-button-with-outline";
  }

  return (
    <button
      onClick={onClick}
      className={className}>
      {label}
    </button>
  );
}

export default Button;