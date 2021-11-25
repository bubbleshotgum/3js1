class SmoothControls {

	constructor( object, domElement ) {
		const scope = this
		this.object = object
		this.domElement = domElement
		this.transformSpeed = 1.2
		this.dynamicDampingFactor = 0.1
		this.translateX = true
		this.translateY = true
		this.translateZ = true
		this.scaleX = false
		this.scaleY = false
		this.scaleZ = false
		this.minPos = 1
		this.maxPos = Infinity
		this.minScale = 1
		this.maxScale = 2

		let _translateStart = 0

		this.update = function () {
            let factor = 1.0 - _translateStart * scope.transformSpeed
            if ( factor !== 1.0 && factor > 0.0 ) {
				scope.object.scale.set(
					scope.scaleX ? 
					(
						scope.object.scale.x / factor > scope.minScale
						&& scope.object.scale.x / factor < scope.maxScale ?
						scope.object.scale.x / factor : 
						scope.object.scale.x / factor < scope.maxScale ? scope.minScale : scope.maxScale
					) : scope.object.scale.x,
					scope.scaleY ? 
					(
						scope.object.scale.y / factor > scope.minScale
						&& scope.object.scale.y / factor < scope.maxScale ?
						scope.object.scale.y / factor : 
						scope.object.scale.y / factor < scope.maxScale ? scope.minScale : scope.maxScale
					) : scope.object.scale.y,
					scope.scaleZ ? 
					(
						scope.object.scale.z / factor > scope.minScale
						&& scope.object.scale.z / factor < scope.maxScale ?
						scope.object.scale.z / factor : 
						scope.object.scale.z / factor < scope.maxScale ? scope.minScale : scope.maxScale
					) : scope.object.scale.z
				)

				scope.object.position.set(
					scope.translateX ? 
					(
						scope.object.position.x * factor > scope.minPos 
						&& scope.object.position.x * factor < scope.maxPos ?
						scope.object.position.x * factor : 
						scope.object.position.x * factor < scope.maxPos ? scope.minPos : scope.maxPos
					) : scope.object.position.x,
					scope.translateY ? 
					(
						scope.object.position.y * factor > scope.minPos 
						&& scope.object.position.y * factor < scope.maxPos ?
						scope.object.position.y * factor : 
						scope.object.position.y * factor < scope.maxPos ? scope.minPos : scope.maxPos
					) : scope.object.position.y,
					scope.translateZ ? 
					(
						scope.object.position.z * factor > scope.minPos 
						&& scope.object.position.z * factor < scope.maxPos ?
						scope.object.position.z * factor : 
						scope.object.position.z * factor < scope.maxPos ? scope.minPos : scope.maxPos
					) : scope.object.position.z
				)
                _translateStart -= _translateStart * scope.dynamicDampingFactor
			}
		}

		function onMouseWheel( event ) {
			event.preventDefault()
            _translateStart += event.deltaY * 0.00025
		}

		this.dispose = function() {
			this.domElement.removeEventListener( 'wheel', onMouseWheel )
		}
		this.embark = function() {
			this.domElement.addEventListener( 'wheel', onMouseWheel, { passive: false } )
		}

		this.embark()
		this.update()
	}
}

export { SmoothControls }