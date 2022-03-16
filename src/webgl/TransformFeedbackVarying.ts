import { Variable } from "./Variable.js";
import { Program } from "./Program.js";

/** An input variable in a WebGL fragment shader used for transform feedback. */
export class TransformFeedbackVarying extends Variable {
  /**
   * Creates a transform feedback varying. This should only be called by the `Program` constructor.
   * @param program - The shader program that this transform feedback varying belongs to.
   * @param index - The index of this transform feedback varying.
   */
  constructor(program: Program, index: number) {
    super(program);

    const activeInfo: WebGLActiveInfo | null = this.gl.getTransformFeedbackVarying(program.program, index);
    if (!activeInfo) { throw new Error("Unable to get transform feedback varying active information."); }
    this.activeInfo = activeInfo;
  }

  /** The active information of this attribute. */
  readonly activeInfo: WebGLActiveInfo;

  /** Does nothing; transform feedback varyings cannot be set. */
  protected readonly setter?: () => void;

  /** Does nothing; transform feedback varyings cannot be set. */
  protected readonly arraySetter?: () => void;
}