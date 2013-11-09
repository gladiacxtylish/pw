//var pixelMeterRatio = 30;
//var b2World;
//var boundaryThickness = 10;

$(document).ready(function(){

$(function(){
	var BoxView = Backbone.View.extend({
		//el: $('canvas'), 
		
		/*
		events: {
			"mousedown #canvas": "mouseDownEventListener", 
			"mouseup #canvas": "mouseUpEventListener"
		}, 
		*/
		
		pixelMeterRatio: 30, 
		boundaryThickness: 10, 
		b2World: null, 
		b2Elements: [], 
		mouseX: 0, 
		mouseY: 0, 
		isMouseDown: false, 
		b2Joint: null, 
		colorsSets: [
			['#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900'], 
			['#ECD078', '#D95B43', '#C02942', '#542437', '#53777A'], 
			['#FE4365', '#FC9D9A', '#F9CDAD', '#C8C8A9', '#83AF9B'], 
			['#E8DDCB', '#CDB380', '#036564', '#033649', '#031634'], 
			['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58'], 
			['#CFF09E', '#A8DBA8', '#79BD9A', '#3B8686', '#0B486B'], 
			['#774F38', '#E08E79', '#F1D4AF', '#ECE5CE', '#C5E0DC'], 
			['#594F4F', '#547980', '#45ADA8', '#9DE0AD', '#E5FCC2'], 
			['#D9CEB2', '#948C75', '#D5DED9', '#7A6A53', '#99B2B7'], 
			['#490A3D', '#BD1550', '#E97F02', '#F8CA00', '#8A9B0F'], 
			['#EFFFCD', '#DCE9BE', '#555152', '#2E2633', '#99173C'], 
			['#00A0B0', '#6A4A3C', '#CC333F', '#EB6841', '#EDC951'], 
			['#D1F2A5', '#EFFAB4', '#FFC48C', '#FF9F80', '#F56991'], 
			['#67917A', '#170409', '#B8AF03', '#CCBF82', '#E33258'], 
			['#8C2318', '#5E8C6A', '#88A65E', '#BFB35A', '#F2C45A'], 
			['#FFFFFF', '#CBE86B', '#F2E9E1', '#1C140D', '#CBE86B'], 
			['#413E4A', '#73626E', '#B38184', '#F0B49E', '#F7E4BE'], 
			['#EEE6AB', '#C5BC8E', '#696758', '#45484B', '#36393B'], 
			['#D3E2B6', '#C3DBB4', '#AACCB1', '#87BDB1', '#68B3AF'], 
			['#351330', '#424254', '#64908A', '#E8CAA4', '#CC2A41'], 
			['#FAD089', '#FF9C5B', '#F5634A', '#ED303C', '#3B8183']
		], 
		
		
		initialize: function () {
			_.bindAll(this, 'mouseDownEventListener', 'mouseUpEventListener', 'updateMouseCoordinates', 'updateWorldEventListener');
			
			//this.pixelMeterRatio = 30;
			//this.boundaryThickness = 10;
			this.b2World = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 9.8), true);
			//this.b2Elements = [];
			//var t = window.innerHeight;
			//var ab =  $(window).height();
			/* calculate height first to account the scrollbar's width */
			//$('#b2dDiv').css('height', $(window).height());
			//$('#b2dDiv').css('width', $(window).width());
			
			
			this.createBoundaries();
			//this.addElementToWorld();
			//this.addInstructionsToWorld();
			//this.addExperiencesToWorld();
			this.addBallsToWorld();
			//this.setDebugDraw();
			//this.mouseX = 0;
			//this.mouseY = 0;
			//this.isMouseDown = false;
			//this.b2Joint = null;
			$('#b2dDiv').mousedown(this.mouseDownEventListener);
			$(document).mouseup(this.mouseUpEventListener);
			setInterval(this.updateWorldEventListener, 1000 / 60);
		}, 
		
		updateWorldEventListener: function (e) {
			
			this.controlMouse();
			this.b2World.Step(1 / 60, 10, 10);
			//this.b2World.DrawDebugData();
			this.b2World.ClearForces();
			
			for (var i = 0; i < this.b2Elements.length; i++) {
				//var e = this.b2Elements[i];
				var element = this.b2Elements[i].GetUserData();
				var x = this.b2Elements[i].GetPosition().x * this.pixelMeterRatio;
				var y = this.b2Elements[i].GetPosition().y * this.pixelMeterRatio;
				//var q = this.b2Elements[i].GetLocalPoint(new Box2D.Common.Math.b2Vec2(50 / this.pixelMeterRatio, 50 / this.pixelMeterRatio));
				element.css('left', this.b2Elements[i].GetPosition().x * this.pixelMeterRatio);
				element.css('top', this.b2Elements[i].GetPosition().y * this.pixelMeterRatio);
				//var tt = this.b2Elements[i].GetAngle() * 180 / Math.PI;
				//var t = this.b2Elements[i].GetAngle() * 180 / Math.PI;
				var rotateDegree = Math.round(this.b2Elements[i].GetAngle() * 180 / Math.PI * 100) / 100
				element.css('-webkit-transform', 'rotate(' + rotateDegree + 'deg)');
				element.css('-moz-transform', 'rotate(' + rotateDegree + 'deg)');
				element.css('msTransform', 'rotate(' + rotateDegree + 'deg)');
			}
			
			
		}, 
		
		mouseDownEventListener: function (event) {
			this.isMouseDown = true;
			this.updateMouseCoordinates (event);
			document.addEventListener("mousemove", this.updateMouseCoordinates, true);
		}, 
		
		mouseUpEventListener: function () {
			document.removeEventListener("mousemove", this.updateMouseCoordinates, true);
			this.isMouseDown = false;
		}, 
		
		updateMouseCoordinates: function (event) {
			//var a = event.pageX;
			//var b = $('#b2dDiv').offset().left;
			this.mouseX = (event.pageX - $('#b2dDiv').offset().left) / this.pixelMeterRatio;
				//this.getElementCoordinates(document.getElementById('canvas')).x) / this.pixelMeterRatio;
			this.mouseY = (event.pageY - $('#b2dDiv').offset().top) / this.pixelMeterRatio;
				//this.getElementCoordinates(document.getElementById('canvas')).y) / this.pixelMeterRatio;
		}, 
		
		
		
		addInstructionsToWorld: function () {
			
			var divElement = $('<div></div>').attr({width: 200, height: 200});
			divElement.css('position', 'absolute');
			//divElement.css('cursor', 'default');
			//divElement.css('left', '0');
			//divElement.css('top', '0');
			//divElement.css('background-color', '#555555');
			divElement.css('border', '1px coral solid');
			divElement.css('-webkit-transform-origin', '0% 0%');
			divElement.css('-moz-transform-origin', '0% 0%');
			divElement.css('msTransformOrigin', '0% 0%');
			$('#b2dDiv').append(divElement);
			//this.b2Elements.push(divElement);
			
			var circleCanvasElement = $('<canvas></canvas>').attr({width: 200, height: 200});
			var graphics = circleCanvasElement[0].getContext('2d');
			graphics.fillStyle = "rgb(200,0,0)";
			graphics.beginPath();
			graphics.arc(100, 100, 100, 0, Math.PI * 2, true);
			graphics.closePath();
			graphics.fill();
			
			divElement.append(circleCanvasElement);
			
			var b2BodyDef = new Box2D.Dynamics.b2BodyDef;
			b2BodyDef.position.Set(10 / this.pixelMeterRatio, 10 / this.pixelMeterRatio);
			b2BodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
			b2BodyDef.userData = divElement;
			
			var b2Body = this.b2World.CreateBody(b2BodyDef);
			var b2CircleShape = new Box2D.Collision.Shapes.b2CircleShape();
			b2CircleShape.SetRadius(100 / this.pixelMeterRatio);
			b2CircleShape.SetLocalPosition(
				new Box2D.Common.Math.b2Vec2(100 / this.pixelMeterRatio, 100 / this.pixelMeterRatio));
			
			var b2FixtureDef = new Box2D.Dynamics.b2FixtureDef();
			b2FixtureDef.shape = b2CircleShape;
			b2FixtureDef.density = 0.7;
			b2FixtureDef.friction = 0.5;
			b2FixtureDef.restitution = 0.5;
			
			b2Body.CreateFixture(b2FixtureDef);
			
			this.b2Elements.push(b2Body);
		},  
		
		
		addEducationsToWorld: function () {
			
			var coordinates = {x: 600, y: 150, radius: 100};
			var surroundRadius = 50;
			var center = this.addElementToWorld(coordinates.x, coordinates.y, 
				coordinates.radius, "#948C75", "Education", "", "#D5DED9");
			var first = this.addElementToWorld(coordinates.x + coordinates.radius / 2, coordinates.y - surroundRadius * 2, 
				surroundRadius, "#948C75", "UCSD", "2008-2011", "#D5DED9");
			var second = this.addElementToWorld(coordinates.x + coordinates.radius / 2, coordinates.y + coordinates.radius * 2, 
				surroundRadius, "#948C75", "De Anza", "2006-2008", "#D5DED9");
			
			/* first */
			var b2DistanceJointDef = new Box2D.Dynamics.Joints.b2DistanceJointDef();
			b2DistanceJointDef.Initialize(center, first, 
				new Box2D.Common.Math.b2Vec2((coordinates.x + coordinates.radius) / this.pixelMeterRatio, (coordinates.y + coordinates.radius) / this.pixelMeterRatio), 
				new Box2D.Common.Math.b2Vec2((coordinates.x + coordinates.radius) / this.pixelMeterRatio, (coordinates.y - surroundRadius) / this.pixelMeterRatio));
			//b2DistanceJointDef.collideConnected = true;
			this.b2World.CreateJoint(b2DistanceJointDef);
			/* second */
			b2DistanceJointDef = new Box2D.Dynamics.Joints.b2DistanceJointDef();
			b2DistanceJointDef.Initialize(center, second, 
				new Box2D.Common.Math.b2Vec2((coordinates.x + coordinates.radius) / this.pixelMeterRatio, (coordinates.y + coordinates.radius) / this.pixelMeterRatio), 
				new Box2D.Common.Math.b2Vec2((coordinates.x + coordinates.radius) / this.pixelMeterRatio, (coordinates.y + coordinates.radius * 2 + surroundRadius) / this.pixelMeterRatio));
			//b2DistanceJointDef.collideConnected = true;
			this.b2World.CreateJoint(b2DistanceJointDef);
			
		}, 
		
		
		addBallsToWorld: function () {
			
			for (var i = 0; i < 30; i++) {
				
				x = Math.floor(Math.random() * ($('#b2dDiv').width() - 100));
				y = Math.floor(Math.random() * ($('#b2dDiv').height() / 20));
				colorsSet = this.colorsSets[Math.floor(Math.random() * this.colorsSets.length)];
				this.addBallToWorld (x, y, Math.floor(Math.random() * 5) + 1, colorsSet);
			}
			
		}, 
		
		
		addBallToWorld: function (x, y, layers, colorsSet) {
			
			var radius = layers * 10;
			var divElement = $('<div></div>').attr({width: radius * 2, height: radius * 2});
			divElement.css('position', 'absolute');
			divElement.css('left', x);
			divElement.css('top', y);
			//divElement.css('border', '1px coral solid');
			divElement.css('-webkit-transform-origin', '0% 0%');
			divElement.css('-moz-transform-origin', '0% 0%');
			divElement.css('msTransformOrigin', '0% 0%');
			$('#b2dDiv').append(divElement);
			//this.b2Elements.push(divElement);
			
			var circleCanvasElement = $('<canvas></canvas>').attr({width: radius * 2, height: radius * 2});
			var graphics = circleCanvasElement[0].getContext('2d');
			
			for (var i = 0; i < layers; i++) {
				graphics.fillStyle = colorsSet[Math.floor(Math.random() * 5)];
				graphics.beginPath();
				graphics.arc(radius, radius, radius - (i * 10), 0, Math.PI * 2, true);
				graphics.closePath();
				graphics.fill();
			}
			
			divElement.append(circleCanvasElement);
			
			var b2BodyDef = new Box2D.Dynamics.b2BodyDef;
			b2BodyDef.position.Set(x / this.pixelMeterRatio, y / this.pixelMeterRatio);
			b2BodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
			/* store user data, div */
			b2BodyDef.userData = divElement;
			
			var b2Body = this.b2World.CreateBody(b2BodyDef);
			var b2CircleShape = new Box2D.Collision.Shapes.b2CircleShape();
			b2CircleShape.SetRadius(radius / this.pixelMeterRatio);
			b2CircleShape.SetLocalPosition(
				new Box2D.Common.Math.b2Vec2(radius / this.pixelMeterRatio, radius / this.pixelMeterRatio));
			
			var b2FixtureDef = new Box2D.Dynamics.b2FixtureDef();
			b2FixtureDef.shape = b2CircleShape;
			b2FixtureDef.density = 1;
			b2FixtureDef.friction = 0.5;
			b2FixtureDef.restitution = 0.2;
			
			b2Body.CreateFixture(b2FixtureDef);
			b2Body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(Math.random() * 40 - 20, Math.random() * 20));
			
			this.b2Elements.push(b2Body);
			
		}, 
		
		
		setDebugDraw: function () {
			
			var b2DebugDraw = new Box2D.Dynamics.b2DebugDraw();
			b2DebugDraw.SetSprite(document.getElementById('canvas').getContext("2d"));
			b2DebugDraw.SetDrawScale(30.0);
			b2DebugDraw.SetFillAlpha(0.5);
			b2DebugDraw.SetLineThickness(1.0);
			b2DebugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | 
				Box2D.Dynamics.b2DebugDraw.e_jointBit);
			this.b2World.SetDebugDraw(b2DebugDraw);
			
			//window.setInterval(this.updateWorld, 1000 / 60);
		}, 
		
		
		controlMouse: function () {
			
			if (this.isMouseDown == true && this.b2Joint == null) {
				var elementAtMouse = this.getElementFromWorld();//alert(elementAtMouse);
				if (elementAtMouse != null) {
					//alert(mouseX);
					var b2MouseJointDef = new Box2D.Dynamics.Joints.b2MouseJointDef();
					b2MouseJointDef.bodyA = this.b2World.GetGroundBody();
					b2MouseJointDef.bodyB = elementAtMouse;
					b2MouseJointDef.target.Set(this.mouseX, this.mouseY);
					//b2MouseJointDef.collideConnected = true;
					b2MouseJointDef.maxForce = 3000 * elementAtMouse.GetMass();
					this.b2Joint = this.b2World.CreateJoint(b2MouseJointDef);
					//elementAtMouse.SetAwake(true);
				}
			}
			if (this.b2Joint != null) {
				if (this.isMouseDown == true) {
					this.b2Joint.SetTarget(new Box2D.Common.Math.b2Vec2(this.mouseX, this.mouseY));
				}
				else {
					this.b2World.DestroyJoint(this.b2Joint);
					this.b2Joint = null;
				}
			}
		}, 
		
		
		
		
		getElementFromWorld: function () {
			
			var mouseVector = new Box2D.Common.Math.b2Vec2(this.mouseX, this.mouseY);
			var elementAtMouse = null;
			
			function queryPointCallback (b2Fixture) {
				//alert(b2Fixture.GetBody().GetType());
				if (b2Fixture.GetBody().GetType() == Box2D.Dynamics.b2Body.b2_dynamicBody) {
					elementAtMouse = b2Fixture.GetBody();
					//alert(elementAtMouse2);
					return false;
				}
				return true;
			}
			
			this.b2World.QueryPoint(queryPointCallback, mouseVector);//alert(elementAtMouse);
			return elementAtMouse;
		}, 
		
		
		
		
		
		getElementCoordinates: function (element) {
			
			var x = 0;
			var y = 0;
			while(element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
				x += element.offsetLeft - element.scrollLeft;
				y += element.offsetTop - element.scrollTop;
				element = element.offsetParent;
			}
			return {x: x, y: y};
		}, 
		
		createBoundaries: function () {
	
			var b2BodyDef;
			var b2Body;
			var b2PolygonShape;
			var b2FixtureDef;
			var boundaryElement = $('#b2dDiv');
			
			/* top */
			b2BodyDef = new Box2D.Dynamics.b2BodyDef;
			b2BodyDef.position.Set(boundaryElement.width() / 2 / this.pixelMeterRatio, 
				0 / this.pixelMeterRatio);
			b2BodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
			b2Body =  this.b2World.CreateBody(b2BodyDef);
			
			b2PolygonShape = new Box2D.Collision.Shapes.b2PolygonShape();
			b2PolygonShape.SetAsBox(boundaryElement.width() / 2 / this.pixelMeterRatio, 
				this.boundaryThickness / 2 / this.pixelMeterRatio);
			
			b2FixtureDef = new Box2D.Dynamics.b2FixtureDef();
			b2FixtureDef.shape = b2PolygonShape;
			b2FixtureDef.friction = 0.5;
			b2FixtureDef.restitution = 0.5;
			
			b2Body.CreateFixture(b2FixtureDef);
			
			
			
			/* bottom */
			b2BodyDef = new Box2D.Dynamics.b2BodyDef;
			b2BodyDef.position.Set(boundaryElement.width() / 2 / this.pixelMeterRatio, 
				boundaryElement.height() / this.pixelMeterRatio);
			b2BodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
			b2Body =  this.b2World.CreateBody(b2BodyDef);
			
			b2PolygonShape = new Box2D.Collision.Shapes.b2PolygonShape();
			b2PolygonShape.SetAsBox(boundaryElement.width() / 2 / this.pixelMeterRatio, 
				this.boundaryThickness / 2 / this.pixelMeterRatio);
			
			b2FixtureDef = new Box2D.Dynamics.b2FixtureDef();
			b2FixtureDef.shape = b2PolygonShape;
			b2FixtureDef.friction = 0.5;
			b2FixtureDef.restitution = 0.5;
			
			b2Body.CreateFixture(b2FixtureDef);
			
			
			/* left */
			b2BodyDef = new Box2D.Dynamics.b2BodyDef;
			b2BodyDef.position.Set(0 / this.pixelMeterRatio, 
				boundaryElement.height() / 2 / this.pixelMeterRatio);
			b2BodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
			b2Body =  this.b2World.CreateBody(b2BodyDef);
			
			b2PolygonShape = new Box2D.Collision.Shapes.b2PolygonShape();
			b2PolygonShape.SetAsBox(this.boundaryThickness / 2 / this.pixelMeterRatio, 
				boundaryElement.height() / 2 / this.pixelMeterRatio);
			
			b2FixtureDef = new Box2D.Dynamics.b2FixtureDef();
			b2FixtureDef.shape = b2PolygonShape;
			b2FixtureDef.friction = 0.5;
			b2FixtureDef.restitution = 0.5;
			
			b2Body.CreateFixture(b2FixtureDef);
			
			
			/* right */
			b2BodyDef = new Box2D.Dynamics.b2BodyDef;
			b2BodyDef.position.Set(boundaryElement.width() / this.pixelMeterRatio, 
				boundaryElement.height() / 2 / this.pixelMeterRatio);
			b2BodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
			b2Body =  this.b2World.CreateBody(b2BodyDef);
			
			b2PolygonShape = new Box2D.Collision.Shapes.b2PolygonShape();
			b2PolygonShape.SetAsBox(this.boundaryThickness / 2 / this.pixelMeterRatio, 
				boundaryElement.height() / 2 / this.pixelMeterRatio);
			
			b2FixtureDef = new Box2D.Dynamics.b2FixtureDef();
			b2FixtureDef.shape = b2PolygonShape;
			b2FixtureDef.friction = 0.5;
			b2FixtureDef.restitution = 0.5;
			
			b2Body.CreateFixture(b2FixtureDef);
			
			
		},
		
		
		pad: function(num, totalChars) {
			var pad = '0';
			num = num + '';
			while (num.length < totalChars) {
				num = pad + num;
			}
			return num;
		},

		// Ratio is between 0 and 1
		changeColor: function(color, ratio, darker) {
			// Trim trailing/leading whitespace
			color = color.replace(/^\s*|\s*$/, '');

			// Expand three-digit hex
			color = color.replace(
				/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i,
				'#$1$1$2$2$3$3'
			);

			// Calculate ratio
			var difference = Math.round(ratio * 256) * (darker ? -1 : 1),
				// Determine if input is RGB(A)
				rgb = color.match(new RegExp('^rgba?\\(\\s*' +
					'(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
					'\\s*,\\s*' +
					'(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
					'\\s*,\\s*' +
					'(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
					'(?:\\s*,\\s*' +
					'(0|1|0?\\.\\d+))?' +
					'\\s*\\)$'
				, 'i')),
				alpha = !!rgb && rgb[4] != null ? rgb[4] : null,

				// Convert hex to decimal
				decimal = !!rgb? [rgb[1], rgb[2], rgb[3]] : color.replace(
					/^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i,
					function() {
						return parseInt(arguments[1], 16) + ',' +
							parseInt(arguments[2], 16) + ',' +
							parseInt(arguments[3], 16);
					}
				).split(/,/),
				returnValue;

			// Return RGB(A)
			return !!rgb ?
				'rgb' + (alpha !== null ? 'a' : '') + '(' +
					Math[darker ? 'max' : 'min'](
						parseInt(decimal[0], 10) + difference, darker ? 0 : 255
					) + ', ' +
					Math[darker ? 'max' : 'min'](
						parseInt(decimal[1], 10) + difference, darker ? 0 : 255
					) + ', ' +
					Math[darker ? 'max' : 'min'](
						parseInt(decimal[2], 10) + difference, darker ? 0 : 255
					) +
					(alpha !== null ? ', ' + alpha : '') +
					')' :
				// Return hex
				[
					'#',
					this.pad(Math[darker ? 'max' : 'min'](
						parseInt(decimal[0], 10) + difference, darker ? 0 : 255
					).toString(16), 2),
					this.pad(Math[darker ? 'max' : 'min'](
						parseInt(decimal[1], 10) + difference, darker ? 0 : 255
					).toString(16), 2),
					this.pad(Math[darker ? 'max' : 'min'](
						parseInt(decimal[2], 10) + difference, darker ? 0 : 255
					).toString(16), 2)
				].join('');
		}


		
		
		
	
	});
	
	var boxView = new BoxView();
});


	
	
	
});

