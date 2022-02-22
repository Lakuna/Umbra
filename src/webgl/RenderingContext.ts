import { Vector2 } from "../math/vector/Vector2.js";
import { Color, ColorMask } from "../types/Color.js";
import { Range } from "../types/Range.js";
import { Numbers1x2, Numbers1x4, Booleans1x4 } from "../types/Tuples.js";
import { Rectangle } from "../types/Rectangle.js";
import { WebGLConstant, BlendEquation, BlendFunction, PolygonFace, TestFunction, WindingOrientation,
  ErrorCode, BehaviorHint, ColorSpaceConversionType, StencilTestAction } from "./WebGLConstant.js";

/** GPU configurations for a WebGL rendering context. */
export const enum PowerPreference {
  /** Let the user agent decide which GPU configuration is most suitable. */
  Default = "default",

  /** Prioritizes rendering performance over power consumption. */
  HighPerformance = "high-performance",

  /** Prioritizes power saving over rendering performance. */
  LowPower = "low-power"
}

/** Allowed packing alignment values. */
export type PackAlignment = 1 | 2 | 4 | 8;

/** An object-oriented interface to the OpenGL ES 3.0 graphics rendering context for a canvas. */
export class RenderingContext {
  /**
   * Creates a rendering context.
   * @param canvas - The canvas that this context is attached to.
   * @param alpha - Indicates if the canvas contains an alpha buffer.
   * @param depth - Indicates that the drawing buffer is requested to have a depth buffer of at least 16 bits.
   * @param stencil - Indicates that the drawing buffer is requested to have a stencil buffer of at least 8 bits.
   * @param desynchronized - Hints the user agent to reduce the latency by desynchronizing the canvas paint cycle from the event loop.
   * @param antialias - Indicates whether or not to perform anti-aliasing if possible.
   * @param failIfMajorPerformanceCaveat - Indicates if a context will be created if the system performance is too low or if no hardware GPU is available.
   * @param powerPreference - A hint to the user agent about what configuration of GPU is suitable for the rendering context.
   * @param premultipliedAlpha - Indicates that the page compositor will assume that the drawing buffer contains colors with pre-multiplied alpha.
   * @param preserveDrawingBuffer - Whether the buffers will not be cleared and will preserve their values until cleared or overwritten by the author.
   */
  constructor(
    canvas: HTMLCanvasElement, alpha?: boolean, depth?: boolean, stencil?: boolean,
    desynchronized?: boolean, antialias?: boolean, failIfMajorPerformanceCaveat?: boolean,
    powerPreference?: PowerPreference, premultipliedAlpha?: boolean, preserveDrawingBuffer?: boolean
  ) {
    // The xrCompatible parameter is not used because its use is discouraged. Use `gl.makeXRCompatible()` instead.
    const gl: WebGL2RenderingContext | null = canvas.getContext("webgl2", {
      alpha, depth, stencil, desynchronized, antialias, failIfMajorPerformanceCaveat,
      powerPreference, premultipliedAlpha, preserveDrawingBuffer
    } as WebGLContextAttributes);
    if (!gl) { throw new Error("WebGL2 is not available for your browser."); }
    this.gl = gl;
  }

  /** The standard WebGL2 interface. */
  readonly gl: WebGL2RenderingContext;

  /** The canvas associated with this context. */
  get canvas(): HTMLCanvasElement {
    return this.gl.canvas;
  }

  /** The dimensions of the drawing buffer. */
  get drawingBufferDims(): Vector2 {
    return new Vector2(this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
  }

  /** The actual context parameters. */
  get contextAttributes(): WebGLContextAttributes {
    return this.gl.getContextAttributes() ?? {};
  }

  /** Whether the context is lost. */
  get isLost(): boolean {
    return this.gl.isContextLost();
  }

  /** The scissor box, which limits drawing to a specified rectangle. */
  get scissorBox(): Rectangle {
    return new Rectangle(...this.gl.getParameter(WebGLConstant.SCISSOR_BOX) as [number, number, number, number]);
  }
  set scissorBox(value: Numbers1x4) {
    this.gl.scissor(...(value as [number, number, number, number]));
  }

  /** The viewport, which specifies the affine transformation of `x` and `y` from normalized device coordinates to window coordinates. */
  get viewport(): Rectangle {
    return new Rectangle(...this.gl.getParameter(WebGLConstant.VIEWPORT) as [number, number, number, number]);
  }
  set viewport(value: Numbers1x4) {
    this.gl.viewport(...(value as [number, number, number, number]));
  }

  /** The maximum size of the viewport. */
  get maxViewportDims(): Vector2 {
    return new Vector2(...(this.gl.getParameter(WebGLConstant.MAX_VIEWPORT_DIMS) as [number, number]));
  }

  /** The active texture unit. Automatically added to `TEXTURE0`. */
  get activeTextureUnit(): number {
    return this.gl.getParameter(WebGLConstant.ACTIVE_TEXTURE) - WebGLConstant.TEXTURE0;
  }
  set activeTextureUnit(value: number) {
    this.gl.activeTexture(WebGLConstant.TEXTURE0 + value);
  }

  /** The maximum texture unit. */
  get maxTextureUnits(): number {
    return this.gl.getParameter(WebGLConstant.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  }

  /** The source and destination blending factors. */
  get blendColor(): Color {
    return new Color(...(this.gl.getParameter(WebGLConstant.BLEND_COLOR) as [number, number, number, number]));
  }
  set blendColor(value: Numbers1x4) {
    this.gl.blendColor(...(value as [number, number, number, number]));
  }

  /** The blend equation for the RGB values. Determines how a new pixel is combined with a pixel already in the framebuffer. */
  get blendEquationRgb(): BlendEquation {
    return this.gl.getParameter(WebGLConstant.BLEND_EQUATION_RGB);
  }
  set blendEquationRgb(value: BlendEquation) {
    this.gl.blendEquationSeparate(value, this.blendEquationAlpha);
  }

  /** The blend equation for the alpha values. Determines how a new pixel is combined with a pixel already in the framebuffer. */
  get blendEquationAlpha(): BlendEquation {
    return this.gl.getParameter(WebGLConstant.BLEND_EQUATION_ALPHA);
  }
  set blendEquationAlpha(value: BlendEquation) {
    this.gl.blendEquationSeparate(this.blendEquationRgb, value);
  }

  /** The blend equation. Determines how a new pixel is combined with a pixel already in the framebuffer. */
  set blendEquation(value: BlendEquation) {
    this.gl.blendEquation(value);
  }

  /** The blend function for the RGB source. Used for blending pixel arithmetic. */
  get blendFuncSrcRgb(): BlendFunction {
    return this.gl.getParameter(WebGLConstant.BLEND_SRC_RGB);
  }
  set blendFuncSrcRgb(value: BlendFunction) {
    this.gl.blendFuncSeparate(value, this.blendFuncDstRgb, this.blendFuncSrcAlpha, this.blendFuncDstAlpha);
  }

  /** The blend function for the RGB destination. Used for blending pixel arithmetic. */
  get blendFuncDstRgb(): BlendFunction {
    return this.gl.getParameter(WebGLConstant.BLEND_DST_RGB);
  }
  set blendFuncDstRgb(value: BlendFunction) {
    this.gl.blendFuncSeparate(this.blendFuncSrcRgb, value, this.blendFuncSrcAlpha, this.blendFuncDstAlpha);
  }

  /** The blend function for the alpha source. Used for blending pixel arithmetic. */
  get blendFuncSrcAlpha(): BlendFunction {
    return this.gl.getParameter(WebGLConstant.BLEND_SRC_ALPHA);
  }
  set blendFuncSrcAlpha(value: BlendFunction) {
    this.gl.blendFuncSeparate(this.blendFuncSrcRgb, this.blendFuncDstRgb, value, this.blendFuncDstAlpha);
  }

  /** The blend function for the alpha destination. Used for blending pixel arithmetic. */
  get blendFuncDstAlpha(): BlendFunction {
    return this.gl.getParameter(WebGLConstant.BLEND_DST_ALPHA);
  }
  set blendFuncDstAlpha(value: BlendFunction) {
    this.gl.blendFuncSeparate(this.blendFuncSrcRgb, this.blendFuncDstRgb, this.blendFuncSrcAlpha, value);
  }

  /** The blend function for the source. Used for blending pixel arithmetic. */
  set blendFuncSrc(value: BlendFunction) {
    this.gl.blendFuncSeparate(value, this.blendFuncDstRgb, value, this.blendFuncDstAlpha);
  }

  /** The blend function for the destination. Used for blending pixel arithmetic. */
  set blendFuncDst(value: BlendFunction) {
    this.gl.blendFuncSeparate(this.blendFuncSrcRgb, value, this.blendFuncSrcAlpha, value);
  }

  /** The color values used when clearing color buffers. */
  get clearColor(): Color {
    return new Color(...(this.gl.getParameter(WebGLConstant.COLOR_CLEAR_VALUE) as [number, number, number, number]));
  }
  set clearColor(value: Numbers1x4) {
    this.gl.clearColor(...(value as [number, number, number, number]));
  }

  /** The clear value for the depth buffer. Clamped between `0` and `1`. */
  get clearDepth(): number {
    return this.gl.getParameter(WebGLConstant.DEPTH_CLEAR_VALUE);
  }
  set clearDepth(value: number) {
    this.gl.clearDepth(value);
  }

  /** The clear value for the stencil buffer. */
  get clearStencil(): number {
    return this.gl.getParameter(WebGLConstant.STENCIL_CLEAR_VALUE);
  }
  set clearStencil(value: number) {
    this.gl.clearStencil(value);
  }

  /** Which color components should be enabled or disabled when drawing or rendering to a framebuffer. */
  get colorMask(): ColorMask {
    return new ColorMask(...(this.gl.getParameter(WebGLConstant.COLOR_WRITEMASK) as [boolean, boolean, boolean, boolean]));
  }
  set colorMask(value: Booleans1x4) {
    this.gl.colorMask(...(value as [boolean, boolean, boolean, boolean]));
  }

  /** Whether front- or back-facing polygons are candidates for culling. */
  get cullFace(): PolygonFace {
    return this.gl.getParameter(WebGLConstant.CULL_FACE_MODE);
  }
  set cullFace(value: PolygonFace) {
    this.gl.cullFace(value);
  }

  /** Specifies the function that compares incoming pixel depth to the current depth buffer value. */
  get depthFunc(): TestFunction {
    return this.gl.getParameter(WebGLConstant.DEPTH_FUNC);
  }
  set depthFunc(value: TestFunction) {
    this.gl.depthFunc(value);
  }

  /** Whether writing into the depth buffer is enabled. */
  get depthMask(): boolean {
    return this.gl.getParameter(WebGLConstant.DEPTH_WRITEMASK);
  }
  set depthMask(value: boolean) {
    this.gl.depthMask(value);
  }

  /** The depth range mapping from normalized device coordinates to window or viewport coordinates. */
  get depthRange(): Range {
    return new Range(...(this.gl.getParameter(WebGLConstant.DEPTH_RANGE) as [number, number]));
  }
  set depthRange(value: Numbers1x2) {
    this.gl.depthRange(...(value as [number, number]));
  }

  /** Whether computed fragment color values can be blended. */
  get enableBlend(): boolean {
    return this.gl.isEnabled(WebGLConstant.BLEND);
  }
  set enableBlend(value: boolean) {
    if (value) { this.gl.enable(WebGLConstant.BLEND); } else { this.gl.disable(WebGLConstant.BLEND); }
  }

  /** Whether polygons can be culled. */
  get enableCullFace(): boolean {
    return this.gl.isEnabled(WebGLConstant.CULL_FACE);
  }
  set enableCullFace(value: boolean) {
    if (value) { this.gl.enable(WebGLConstant.CULL_FACE); } else { this.gl.disable(WebGLConstant.CULL_FACE); }
  }

  /** Whether the depth buffer can be updated. */
  get enableDepthTest(): boolean {
    return this.gl.isEnabled(WebGLConstant.DEPTH_TEST);
  }
  set enableDepthTest(value: boolean) {
    if (value) { this.gl.enable(WebGLConstant.DEPTH_TEST); } else { this.gl.disable(WebGLConstant.DEPTH_TEST); }
  }

  /** Whether color components can be dithered before they get written to the color buffer. */
  get enableDither(): boolean {
    return this.gl.isEnabled(WebGLConstant.DITHER);
  }
  set enableDither(value: boolean) {
    if (value) { this.gl.enable(WebGLConstant.DITHER); } else { this.gl.disable(WebGLConstant.DITHER); }
  }

  /** Whether an offset can be added to the depth values of polygons' fragments. */
  get enablePolygonOffsetFill(): boolean {
    return this.gl.isEnabled(WebGLConstant.POLYGON_OFFSET_FILL);
  }
  set enablePolygonOffsetFill(value: boolean) {
    if (value) { this.gl.enable(WebGLConstant.POLYGON_OFFSET_FILL); } else { this.gl.disable(WebGLConstant.POLYGON_OFFSET_FILL); }
  }

  /** Whether a temporary coverage value is computed based on the alpha value. */
  get enableSampleAlphaToCoverage(): boolean {
    return this.gl.isEnabled(WebGLConstant.SAMPLE_ALPHA_TO_COVERAGE);
  }
  set enableSampleAlphaToCoverage(value: boolean) {
    if (value) { this.gl.enable(WebGLConstant.SAMPLE_ALPHA_TO_COVERAGE); } else { this.gl.disable(WebGLConstant.SAMPLE_ALPHA_TO_COVERAGE); }
  }

  /** Whether the fragment's coverage should be combined with the temporary coverage value. */
  get enableSampleCoverage(): boolean {
    return this.gl.isEnabled(WebGLConstant.SAMPLE_COVERAGE);
  }
  set enableSampleCoverage(value: boolean) {
    if (value) { this.gl.enable(WebGLConstant.SAMPLE_COVERAGE); } else { this.gl.disable(WebGLConstant.SAMPLE_COVERAGE); }
  }

  /** Whether the scissor test should be used to discard fragments that are outside of the scissor rectangle. */
  get enableScissorTest(): boolean {
    return this.gl.isEnabled(WebGLConstant.SCISSOR_TEST);
  }
  set enableScissorTest(value: boolean) {
    if (value) { this.gl.enable(WebGLConstant.SCISSOR_TEST); } else { this.gl.disable(WebGLConstant.SCISSOR_TEST); }
  }

  /** Whether the stencil buffer can be updated. */
  get enableStencilTest(): boolean {
    return this.gl.isEnabled(WebGLConstant.STENCIL_TEST);
  }
  set enableStencilTest(value: boolean) {
    if (value) { this.gl.enable(WebGLConstant.STENCIL_TEST); } else { this.gl.disable(WebGLConstant.STENCIL_TEST); }
  }

  /** Whether primitives should be discarded immediately before the rasterization stage (after the transform feedback stage). */
  get enableRasterizerDiscard(): boolean {
    return this.gl.isEnabled(WebGLConstant.RASTERIZER_DISCARD);
  }
  set enableRasterizerDiscard(value: boolean) {
    if (value) { this.gl.enable(WebGLConstant.RASTERIZER_DISCARD); } else { this.gl.disable(WebGLConstant.RASTERIZER_DISCARD); }
  }

  /** Specifies whether polygons are front- or back-facing by setting a winding orientation. */
  get frontFace(): WindingOrientation {
    return this.gl.getParameter(WebGLConstant.FRONT_FACE);
  }
  set frontFace(value: WindingOrientation) {
    this.gl.frontFace(value);
  }

  /** Error information about this context. */
  get error(): ErrorCode {
    return this.gl.getError();
  }

  /** The quality of filtering when generating mipmap images. */
  get generateMipmapHint(): BehaviorHint {
    return this.gl.getParameter(WebGLConstant.GENERATE_MIPMAP_HINT);
  }
  set generateMipmapHint(value: BehaviorHint) {
    this.gl.hint(WebGLConstant.GENERATE_MIPMAP_HINT, value);
  }

  /** The accuracy of the derivative calculation. */
  get fragmentShaderDerivativeHint(): BehaviorHint {
    return this.gl.getParameter(WebGLConstant.FRAGMENT_SHADER_DERIVATIVE_HINT);
  }
  set fragmentShaderDerivativeHint(value: BehaviorHint) {
    this.gl.hint(WebGLConstant.FRAGMENT_SHADER_DERIVATIVE_HINT, value);
  }

  /** The width of rasterized lines. */
  get lineWidth(): number {
    return this.gl.getParameter(WebGLConstant.LINE_WIDTH);
  }
  set lineWidth(value: number) {
    this.gl.lineWidth(value);
  }

  /** The supported range of widths of rasterized lines. */
  get aliasedLineWidthRange(): Range {
    return new Range(...(this.gl.getParameter(WebGLConstant.ALIASED_LINE_WIDTH_RANGE) as [number, number]));
  }

  /** How pixel data is packed into memory. */
  get packAlignment(): PackAlignment {
    return this.gl.getParameter(WebGLConstant.PACK_ALIGNMENT);
  }
  set packAlignment(value: PackAlignment) {
    this.gl.pixelStorei(WebGLConstant.PACK_ALIGNMENT, value);
  }

  /** How pixel data is unpacked from memory. */
  get unpackAlignment(): PackAlignment {
    return this.gl.getParameter(WebGLConstant.UNPACK_ALIGNMENT);
  }
  set unpackAlignment(value: PackAlignment) {
    this.gl.pixelStorei(WebGLConstant.UNPACK_ALIGNMENT, value);
  }

  /** Whether to flip the source data along the vertical axis. */
  get unpackFlipY(): boolean {
    return this.gl.getParameter(WebGLConstant.UNPACK_FLIP_Y_WEBGL);
  }
  set unpackFlipY(value: boolean) {
    this.gl.pixelStorei(WebGLConstant.UNPACK_FLIP_Y_WEBGL, value);
  }

  /** Whether to multiply the alpha channel into the other color channels. */
  get unpackPremultiplyAlpha(): boolean {
    return this.gl.getParameter(WebGLConstant.UNPACK_PREMULTIPLY_ALPHA_WEBGL);
  }
  set unpackPremultiplyAlpha(value: boolean) {
    this.gl.pixelStorei(WebGLConstant.UNPACK_PREMULTIPLY_ALPHA_WEBGL, value);
  }

  /** What type of color space conversion to use. */
  get unpackColorspaceConversion(): ColorSpaceConversionType {
    return this.gl.getParameter(WebGLConstant.UNPACK_COLORSPACE_CONVERSION_WEBGL);
  }
  set unpackColorspaceConversion(value: ColorSpaceConversionType) {
    this.gl.pixelStorei(WebGLConstant.UNPACK_COLORSPACE_CONVERSION_WEBGL, value);
  }

  /** The number of pixels in a row. */
  get packRowLength(): number {
    return this.gl.getParameter(WebGLConstant.PACK_ROW_LENGTH);
  }
  set packRowLength(value: number) {
    this.gl.pixelStorei(WebGLConstant.PACK_ROW_LENGTH, value);
  }

  /** The number of pixel locations skipped before the first pixel is written into memory. */
  get packSkipPixels(): number {
    return this.gl.getParameter(WebGLConstant.PACK_SKIP_PIXELS);
  }
  set packSkipPixels(value: number) {
    this.gl.pixelStorei(WebGLConstant.PACK_SKIP_PIXELS, value);
  }

  /** The number of rows of pixel locations skipped before the first pixel is written into memory. */
  get packSkipRows(): number {
    return this.gl.getParameter(WebGLConstant.PACK_SKIP_ROWS);
  }
  set packSkipRows(value: number) {
    this.gl.pixelStorei(WebGLConstant.PACK_SKIP_ROWS, value);
  }

  /** The number of pixels in a row. */
  get unpackRowLength(): number {
    return this.gl.getParameter(WebGLConstant.UNPACK_ROW_LENGTH);
  }
  set unpackRowLength(value: number) {
    this.gl.pixelStorei(WebGLConstant.UNPACK_ROW_LENGTH, value);
  }

  /** The image height used for reading pixel data from memory. */
  get unpackImageHeight(): number {
    return this.gl.getParameter(WebGLConstant.UNPACK_IMAGE_HEIGHT);
  }
  set unpackImageHeight(value: number) {
    this.gl.pixelStorei(WebGLConstant.UNPACK_IMAGE_HEIGHT, value);
  }

  /** The number of pixels skipped before the first pixel is read from memory. */
  get unpackSkipPixels(): number {
    return this.gl.getParameter(WebGLConstant.UNPACK_SKIP_PIXELS);
  }
  set unpackSkipPixels(value: number) {
    this.gl.pixelStorei(WebGLConstant.UNPACK_SKIP_PIXELS, value);
  }

  /** The number of rows of pixel locations skipped before the first pixel is read from memory. */
  get unpackSkipRows(): number {
    return this.gl.getParameter(WebGLConstant.UNPACK_SKIP_ROWS);
  }
  set unpackSkipRows(value: number) {
    this.gl.pixelStorei(WebGLConstant.UNPACK_SKIP_ROWS, value);
  }

  /** The number of pixel images skipped before the first pixel is read from memory. */
  get unpackSkipImages(): number {
    return this.gl.getParameter(WebGLConstant.UNPACK_SKIP_IMAGES);
  }
  set unpackSkipImages(value: number) {
    this.gl.pixelStorei(WebGLConstant.UNPACK_SKIP_IMAGES, value);
  }

  /** The scale factor used to calculate depth values. */
  get polygonOffsetFactor(): number {
    return this.gl.getParameter(WebGLConstant.POLYGON_OFFSET_FACTOR);
  }
  set polygonOffsetFactor(value: number) {
    this.gl.polygonOffset(value, this.polygonOffsetUnits);
  }

  /** The units used to calculate depth values. */
  get polygonOffsetUnits(): number {
    return this.gl.getParameter(WebGLConstant.POLYGON_OFFSET_UNITS);
  }
  set polygonOffsetUnits(value: number) {
    this.gl.polygonOffset(this.polygonOffsetFactor, value);
  }

  /** Specifies the multi-sample coverage value for anti-aliasing effects. Clamped between `0` and `1`. */
  get sampleCoverageValue(): number {
    return this.gl.getParameter(WebGLConstant.SAMPLE_COVERAGE_VALUE);
  }
  set sampleCoverageValue(value: number) {
    this.gl.sampleCoverage(value, this.sampleCoverageInvert);
  }

  /** Specifies whether to invert the multi-sample coverage for anti-aliasing effects. */
  get sampleCoverageInvert(): boolean {
    return this.gl.getParameter(WebGLConstant.SAMPLE_COVERAGE_INVERT);
  }
  set sampleCoverageInvert(value: boolean) {
    this.gl.sampleCoverage(this.sampleCoverageValue, value);
  }

  /** The function value for stencil testing on front-facing polygons. */
  get stencilFuncFront(): TestFunction {
    return this.gl.getParameter(WebGLConstant.STENCIL_FUNC);
  }
  set stencilFuncFront(value: TestFunction) {
    this.gl.stencilFuncSeparate(PolygonFace.FRONT, value, this.stencilRefFront, this.stencilMaskFront);
  }

  /** The reference value for stencil testing on front-facing polygons. */
  get stencilRefFront(): number {
    return this.gl.getParameter(WebGLConstant.STENCIL_REF);
  }
  set stencilRefFront(value: number) {
    this.gl.stencilFuncSeparate(PolygonFace.FRONT, this.stencilFuncFront, value, this.stencilMaskFront);
  }

  /** The bitwise mask combined with the stored stencil value after the stencil test on front-facing polygons. */
  get stencilValueMaskFront(): number {
    return this.gl.getParameter(WebGLConstant.STENCIL_VALUE_MASK);
  }
  set stencilValueMaskFront(value: number) {
    this.gl.stencilFuncSeparate(PolygonFace.FRONT, this.stencilFuncFront, this.stencilRefBack, value);
  }

  /** The function value for stencil testing on back-facing polygons. */
  get stencilFuncBack(): TestFunction {
    return this.gl.getParameter(WebGLConstant.STENCIL_BACK_FUNC);
  }
  set stencilFuncBack(value: TestFunction) {
    this.gl.stencilFuncSeparate(PolygonFace.BACK, value, this.stencilRefBack, this.stencilValueMaskBack);
  }

  /** The reference value for stencil testing on back-facing polygons. */
  get stencilRefBack(): number {
    return this.gl.getParameter(WebGLConstant.STENCIL_BACK_REF);
  }
  set stencilRefBack(value: number) {
    this.gl.stencilFuncSeparate(PolygonFace.BACK, this.stencilFuncBack, value, this.stencilValueMaskBack);
  }

  /** The bitwise mask combined with the stored stencil value after the stencil test on back-facing polygons. */
  get stencilValueMaskBack(): number {
    return this.gl.getParameter(WebGLConstant.STENCIL_BACK_VALUE_MASK);
  }
  set stencilValueMaskBack(value: number) {
    this.gl.stencilFuncSeparate(PolygonFace.BACK, this.stencilFuncBack, this.stencilRefBack, value);
  }

  /** The function value for stencil testing. */
  set stencilFunc(value: TestFunction) {
    this.gl.stencilFunc(value, this.stencilRef, this.stencilValueMask);
  }

  /** The reference value for stencil testing. */
  set stencilRef(value: number) {
    this.gl.stencilFunc(this.stencilFunc, value, this.stencilValueMask);
  }

  /** The bitwise mask combined with the stored stencil value after the stencil test. */
  set stencilValueMask(value: number) {
    this.gl.stencilFunc(this.stencilFunc, this.stencilRef, value);
  }

  /** The mask used to control writing individual bits to front-facing stencil planes. */
  get stencilMaskFront(): number {
    return this.gl.getParameter(WebGLConstant.STENCIL_WRITEMASK);
  }
  set stencilMaskFront(value: number) {
    this.gl.stencilMaskSeparate(PolygonFace.FRONT, value);
  }

  /** The mask used to control writing individual bits to back-facing stencil planes. */
  get stencilMaskBack(): number {
    return this.gl.getParameter(WebGLConstant.STENCIL_BACK_WRITEMASK);
  }
  set stencilMaskBack(value: number) {
    this.gl.stencilMaskSeparate(PolygonFace.BACK, value);
  }

  /** The mask used to control writing individual bits to stencil planes. */
  set stencilMask(value: number) {
    this.gl.stencilMask(value);
  }

  /** The stencil writemask bits value. */
  get stencilBits(): number {
    return this.gl.getParameter(WebGLConstant.STENCIL_BITS);
  }

  /** The action to be taken when the stencil test fails for front-facing polygons. */
  get stencilFailFront(): StencilTestAction {
    return this.gl.getParameter(WebGLConstant.STENCIL_FAIL);
  }
  set stencilFailFront(value: StencilTestAction) {
    this.gl.stencilOpSeparate(PolygonFace.FRONT, value, this.stencilZFailFront, this.stencilZPassFront);
  }

  /** The action to be taken when the stencil test passes but the depth test fails for front-facing polygons. */
  get stencilZFailFront(): StencilTestAction {
    return this.gl.getParameter(WebGLConstant.STENCIL_PASS_DEPTH_FAIL);
  }
  set stencilZFailFront(value: StencilTestAction) {
    this.gl.stencilOpSeparate(PolygonFace.FRONT, this.stencilFailFront, value, this.stencilZPassFront);
  }

  /** The action to be taken when the stencil test passes and the depth test passes for front-facing polygons. */
  get stencilZPassFront(): StencilTestAction {
    return this.gl.getParameter(WebGLConstant.STENCIL_PASS_DEPTH_PASS);
  }
  set stencilZPassFront(value: StencilTestAction) {
    this.gl.stencilOpSeparate(PolygonFace.FRONT, this.stencilFailFront, this.stencilZFailFront, value);
  }

  /** The action to be taken when the stencil test fails for back-facing polygons. */
  get stencilFailBack(): StencilTestAction {
    return this.gl.getParameter(WebGLConstant.STENCIL_BACK_FAIL);
  }
  set stencilFailBack(value: StencilTestAction) {
    this.gl.stencilOpSeparate(PolygonFace.BACK, value, this.stencilZFailBack, this.stencilZPassBack);
  }

  /** The action to be taken when the stencil test passes but the depth test fails for back-facing polygons. */
  get stencilZFailBack(): StencilTestAction {
    return this.gl.getParameter(WebGLConstant.STENCIL_BACK_PASS_DEPTH_FAIL);
  }
  set stencilZFailBack(value: StencilTestAction) {
    this.gl.stencilOpSeparate(PolygonFace.BACK, this.stencilFailBack, value, this.stencilZPassBack);
  }

  /** The action to be taken when the stencil test passes and the depth test passes for back-facing polygons. */
  get stencilZPassBack(): StencilTestAction {
    return this.gl.getParameter(WebGLConstant.STENCIL_BACK_PASS_DEPTH_PASS);
  }
  set stencilZPassBack(value: StencilTestAction) {
    this.gl.stencilOpSeparate(PolygonFace.BACK, this.stencilFailBack, this.stencilZFailBack, value);
  }

  /** The action to be taken when the stencil test fails. */
  set stencilFail(value: StencilTestAction) {
    this.gl.stencilOp(value, this.stencilZFail, this.stencilZPass);
  }

  /** The action to be taken when the stencil test passes but the depth test fails. */
  set stencilZFail(value: StencilTestAction) {
    this.gl.stencilOp(this.stencilFail, value, this.stencilZPass);
  }

  /** The action to be taken when the stencil test passes and the depth test passes. */
  set stencilZPass(value: StencilTestAction) {
    this.gl.stencilOp(this.stencilFail, this.stencilZFail, value);
  }
}

// TODO: gl.getParameter() getters for every extra parameter.
// TODO: Restore lost context. See https://www.khronos.org/webgl/wiki/HandlingContextLost.
