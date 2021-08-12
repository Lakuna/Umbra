/** @external {WebGLVertexArrayObject} https://developer.mozilla.org/en-US/docs/Web/API/WebGLVertexArrayObjecthttps://developer.mozilla.org/en-US/docs/Web/API/WebGLVertexArrayObject */

import { Attribute } from "./Attribute.js";
import { Buffer } from "./Buffer.js";
import { ELEMENT_ARRAY_BUFFER, UNSIGNED_BYTE, TRIANGLES } from "./constants.js";

/** Class representing a WebGL vertex array object. */
export class VAO {
	#indices;
	#attributes;

	/**
	 * Create a vertex array object.
	 * @param {Program} program - The program that this VAO is used with.
	 * @param {Attribute[]} attributes - The attributes associated with this VAO.
	 * @param {number[]} indexData - The data to pass to the ELEMENT_ARRAY_BUFFER for this VAO.
	 */
	constructor(program, attributes, indexData) {
		/**
		 * The program that this VAO is used with.
		 * @type {Program}
		 */
		this.program = program;

		/**
		 * The rendering context of this VAO.
		 * @type {WebGLRenderingContext}
		 */
		this.gl = program.gl;

		/**
		 * The VAO used by WebGL.
		 * @type {WebGLVertexArrayObject}
		 */
		this.vao = this.gl.createVertexArray();

		/** @ignore */ this.#attributes = [];
		attributes.forEach((attribute) => this.addAttribute(attribute));

		this.indexData = indexData; // Use setter.
	}

	/**
	 * Add an attribute to this VAO.
	 * @param {Attribute} attribute - The attribute to add.
	 */
	addAttribute(attribute) {
		this.bind();
		attribute.use(this.program);
		this.#attributes.push(attribute);
	}

	/**
	 * A list of attributes attached to this VAO. Note that this returns a copy of the list, so modifying it directly doesn't do anything.
	 * @type {Attribute[]}
	 */
	get attributes() {
		return [...this.#attributes];
	}

	/**
	 * The ELEMENT_ARRAY_BUFFER attribute of this VAO.
	 * @type {Attribute}
	 */
	get indices() {
		return this.#indices;
	}

	/**
	 * The data of the ELEMENT_ARRAY_BUFFER attribute of this VAO.
	 * @type {number[]}
	 */
	set indexData(value) {
		this.bind();
		/** @ignore */ this.#indices = value
			? this.#indices = new Attribute(null, new Buffer(this.gl, new Uint8Array(value), ELEMENT_ARRAY_BUFFER), 1, UNSIGNED_BYTE)
			: null;
	}

	/**
	 * Binds this VAO.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/bindVertexArray
	 */
	bind() {
		this.gl.bindVertexArray(this.vao);
	}

	/**
	 * Draws the vertex data stored in this VAO.
	 * @param {number} [mode=TRIANGLES] - The mode to use when drawing the data.
	 * @param {number} [offset=0] - The number of elements to skip when drawing arrays.
	 */
	draw(mode = TRIANGLES, offset = 0) {
		this.program.use();
		this.bind();

		if (this.indices) {
			this.gl.drawElements(mode, this.indices.buffer.data.length, this.indices.type, this.indices.offset);
		} else {
			this.gl.drawArrays(mode, offset, this.attributes?.[0].buffer.data.length / this.attributes?.[0].size ?? 0);
		}
	}
}