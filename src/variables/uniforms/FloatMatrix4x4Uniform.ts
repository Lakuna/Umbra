import MatrixUniform from "#MatrixUniform";
import type MeasuredIterable from "#MeasuredIterable";

/** A float 4x4 matrix global variable in a WebGL shader program. */
export default class FloatMatrix4x4Uniform extends MatrixUniform {
    /** The setter method for this uniform if the value is an array. */
    public arraySetter(value: MeasuredIterable<number>): void {
        this.context.internal.uniformMatrix4fv(this.location, this.transpose, value, this.sourceOffset, this.sourceLength);
    }
}