import {
	Vector2
} from 'three';

/**
 * Dot screen shader
 * based on glfx.js sepia shader
 * https://github.com/evanw/glfx.js
 */

const CustomPass = {

	uniforms: {

		'tDiffuse': { value: null },
		'time': { value: 0 },
		'scale': { value: 1. },
		'progress': { value: 0 },
		'tSize': { value: new Vector2( 256, 256 ) },
		'center': { value: new Vector2( 0.5, 0.5 ) },
		'angle': { value: 1.57 },
		'scale': { value: 1. },
		'modifier': { value: 1. },
		'Power': { value: 1. }

	},

	vertexShader: /* glsl */`
		varying vec2 vUv;
		uniform float progress;
		uniform float modifier;
		uniform float scale;
		uniform float time;
		void main() {
			float M_PI = 3.14159265;
			vUv = uv;
			vec3 newPosition = position;
			if(progress > 0.)
			{
				vec2 p = 2.*vUv - vec2(1.);
				p += .5 * cos(scale * 2.*p.yx + time + vec2(1.2, 3.4));
				p += sin(scale * 3.7*p.yx + 1.4*time + vec2(2.2, 3.4));
				p += cos(scale * 5.*p.yx + 2.6*time + vec2(4.2, 1.4));
				p += cos(scale * 7.*p.yx + 3.6*time + vec2(10.2, 3.4));

				newPosition.x += mix(vUv.x,length(p),progress);
				newPosition.y += mix(vUv.y,0.,progress);
				newPosition += progress * scale * 3. * modifier * sin(vec3(uv.xy, 10.) + M_PI + time);
			}
			gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
		}`,

	fragmentShader: /* glsl */`

		uniform vec2 center;
		uniform float angle;
		uniform float time;
		uniform float progress;
		uniform float modifier;
		uniform float scale;
		uniform vec2 tSize;

		uniform sampler2D uTexture;

		varying vec2 vUv;

		float pattern() {

			float s = sin( angle ), c = cos( angle );

			vec2 tex = vUv * tSize - center;
			vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;

			return ( sin( point.x ) * sin( point.y ) ) * 4.0;

		}

		void main() {
			vec2 newUV = vUv;

			if(progress > 0.)
			{
				vec2 p = 2.*vUv - vec2(1.);
				p += cos(scale * 2.*p.yx + time + vec2(1.2, 3.4))*modifier;
				p += cos(scale * 3.7*p.yx + 1.4*time + vec2(2.2, 3.4))*modifier;
				p += cos(scale * 5.*p.yx + 2.6*time + vec2(4.2, 1.4))*modifier;
				p += cos(scale * 7.*p.yx + 3.6*time + vec2(10.2, 3.4))*modifier;

				newUV.x = mix(vUv.x,length(p),progress);
				newUV.y = mix(vUv.y,0.,progress);
			}

			vec4 color = texture2D(uTexture, newUV);
			gl_FragColor = color;
		}`

};

export { CustomPass };
