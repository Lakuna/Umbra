import { GameObject } from "../core/GameObject.js";
import { Mesh } from "./Mesh.js";
import { Component, Event } from "../core/Component.js";
import { Umbra } from "../core/Umbra.js";
import { mat4 } from "gl-matrix";

/** A viewpoint for a scene. */
export abstract class Camera extends GameObject {
  /**
   * Creates a camera.
   * @param parent - The parent object of the camera.
   * @param near - The nearest that the camera can see.
   * @param far - The farthest that the camera can see.
   */
  public constructor(parent?: GameObject, near = 0.1, far = 1000) {
    super(parent);
    this.near = near;
    this.far = far;
  }

  /** The nearest that this camera can see. */
  public near: number;

  /** The farthest that this camera can see. */
  public far: number;

  /** The projection matrix of this camera. */
  public abstract get projectionMatrix(): mat4;

  /** The view matrix of this camera. */
  public get viewMatrix(): mat4 {
    return mat4.invert(mat4.create(), this.worldMatrix);
  }

  /** The view projection matrix of this camera. */
  public get viewProjectionMatrix(): mat4 {
    const projectionMatrix: mat4 = this.projectionMatrix;
    return mat4.multiply(projectionMatrix, projectionMatrix, this.viewMatrix);
  }

  /**
   * Calculates the world view projection matrix of a mesh when viewed by this camera.
   * @param mesh - The mesh.
   * @returns The world view projection matrix of the mesh.
   */
  public worldViewProjectionMatrix(mesh: Mesh): mat4 {
    const viewProjectionMatrix: mat4 = this.viewProjectionMatrix;
    return mat4.multiply(viewProjectionMatrix, viewProjectionMatrix, mesh.gameObject.worldMatrix);
  }
}

/** A viewpoint for a scene with perspective. */
export class PerspectiveCamera extends Camera {
  /**
   * Creates a perspective camera.
   * @param parent - The parent object of the camera.
   * @param near - The nearest that the camera can see.
   * @param far - The farthest that the camera can see.
   * @param fov - The field of view of the camera in radians.
   * @param aspectRatio - The aspect ratio of the camera. Updates automatically to the canvas' aspect ratio if not set.
   */
  public constructor(parent?: GameObject, near = 0.1, far = 1000, fov = Math.PI / 4, aspectRatio?: number) {
    super(parent, near, far);
    this.fov = fov;
    if (aspectRatio) {
      this.aspectRatio = aspectRatio;
    } else {
      this.aspectRatio = 1;

      // Create a component to automatically update the aspect ratio.
      new Component(this).events.set(Event.Update, (umbra: Umbra): void => {
        this.aspectRatio = umbra.gl.canvas.width / umbra.gl.canvas.height;
      });
    }
  }

  /** The field of view of this camera in radians. */
  public fov: number;

  /** The aspect ratio of this camera. */
  public aspectRatio: number;

  /** The projection matrix of this camera. */
  public get projectionMatrix(): mat4 {
    return mat4.perspective(mat4.create(), this.fov, this.aspectRatio, this.near, this.far);
  }
}

/** A viewpoint for a scene without perspective. */
export class OrthographicCamera extends Camera {
  /**
   * Creates an orthographic camera.
   * @param left - The left boundary of the viewport.
   * @param right - The right boundary of the viewport.
   * @param bottom - The bottom boundary of the viewport.
   * @param top - The top boundary of the viewport.
   * @param near - The near boundary of the viewport.
   * @param far - The far boundary of the viewport.
   * @param parent - The parent object of the camera.
   */
  public constructor(left: number, right: number, bottom: number, top: number, near: number, far: number, parent?: GameObject) {
    super(parent, near, far);
    this.left = left;
    this.right = right;
    this.bottom = bottom;
    this.top = top;
  }

  /** The left boundary of the viewport. */
  public left: number;

  /** The right boundary of the viewport. */
  public right: number;

  /** The bottom boundary of the viewport. */
  public bottom: number;

  /** The top boundary of the viewport. */
  public top: number;

  /** The projection matrix of this camera. */
  public get projectionMatrix(): mat4 {
    return mat4.ortho(mat4.create(), this.left, this.right, this.bottom, this.top, this.near, this.far);
  }
}
