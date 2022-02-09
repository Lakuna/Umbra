import { Color } from "./Color.js";
import { Rectangle } from "./Rectangle.js";
import { Quaternion } from "../math/Quaternion.js";
import { Matrix2 } from "../math/matrix/Matrix2.js";
import { Matrix3 } from "../math/matrix/Matrix3.js";
import { Matrix4 } from "../math/matrix/Matrix4.js";
import { Vector2 } from "../math/vector/Vector2.js";
import { Vector3 } from "../math/vector/Vector3.js";
import { Vector4 } from "../math/vector/Vector4.js";

/** Two numbers. */
export type Numbers1x2 = Vector2 | [number, number];

/** Three numbers. */
export type Numbers1x3 = Vector3 | [number, number, number];

/** Four numbers. */
export type Numbers1x4 = Color | Rectangle | Quaternion | Vector4 | [number, number, number, number];

/** Two rows of two numbers. */
export type Numbers2x2 = Matrix2 | [
  number, number,
  number, number
];

/** Three rows of three numbers. */
export type Numbers3x3 = Matrix3 | [
  number, number, number,
  number, number, number,
  number, number, number
];

/** Four rows of four numbers. */
export type Numbers4x4 = Matrix4 | [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number
];
