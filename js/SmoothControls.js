class SmoothControls {

	constructor( object, autoEmbarkOnInit=false, scale=false, translate=true) {
		const scope = this
		this.object = object
		this.embarked = false
		this.transformSpeed = 1.2
		this.dynamicDampingFactor = 0.1
		//READONLY------------------------
		this.translateX = translate
		this.translateY = translate
		this.translateZ = translate
		this.translate = [translate, translate, translate]
		this.scaleX = scale
		this.scaleY = scale
		this.scaleZ = scale
		this.scale = [scale, scale, scale]
		//--------------------------------
		this.minPos = 1
		this.maxPos = Infinity
		this.minScale = 1
		this.maxScale = 2

		let _translateStart = 0

		this.update = function () {
			const coords = ["x", "y", "z"]
            let factor = 1.0 - _translateStart * scope.transformSpeed
            if ( factor !== 1.0 && factor > 0.0 ) {
				for(let i = 0; i < 3; i++)
				{
					if(scope.scale[i])
					scope.object.scale[coords[i]] = 
						scope.object.scale[coords[i]] / factor > scope.minScale
						&& scope.object.scale[coords[i]] / factor < scope.maxScale ?
						scope.object.scale[coords[i]] / factor : 
						scope.object.scale[coords[i]] / factor < scope.maxScale ? scope.minScale : scope.maxScale
					if(scope.translate[i])
					scope.object.position[coords[i]] = 
					scope.object.position[coords[i]] * factor > scope.minPos 
						&& scope.object.position[coords[i]] * factor < scope.maxPos ?
						scope.object.position[coords[i]] * factor : 
						scope.object.position[coords[i]] * factor < scope.maxPos ? scope.minPos : scope.maxPos
				}
                _translateStart -= _translateStart * scope.dynamicDampingFactor
			}
		}

		function onMouseWheel( event ) {
			event.preventDefault()
            _translateStart += event.deltaY * 0.00025
		}
		this.setScale = function(x, y, z) {
			scope.scaleX = x
			scope.scaleY = y
			scope.scaleZ = z
			scope.scale = [x, y, z]
		}
		this.setTranslate = function(x, y, z) {
			scope.translateX = x
			scope.translateY = y
			scope.translateZ = z
			scope.translate = [x, y, z]
		} 
		this.dispose = function() {
			window.removeEventListener( 'wheel', onMouseWheel )
			this.embarked = false
		}
		this.embark = function() {
			window.addEventListener( 'wheel', onMouseWheel, { passive: false } )
			this.embarked = true
		}

		if(autoEmbarkOnInit)
			this.embark()
		this.update()
	}
}

export { SmoothControls }