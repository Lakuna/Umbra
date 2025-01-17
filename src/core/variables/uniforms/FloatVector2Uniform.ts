import Vector2Uniform from "./Vector2Uniform.js";

/**
 * A floating-point 2D vector global variable in a shader program.
 * @internal
 */
export default class FloatVector2Uniform extends Vector2Uniform {
	/**
	 * Set the value of this uniform if the value is iterable.
	 * @param value - The value to pass to the uniform.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform | uniform[1234][uif][v]}
	 * @internal
	 */
	public override iterableSetterInternal(value: Iterable<number>): void {
		this.gl.uniform2fv(
			this.location,
			value,
			this.sourceOffset,
			this.sourceLength
		);
	}
}
