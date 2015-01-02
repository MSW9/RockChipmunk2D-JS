/** ----------------------------------------------------------------------------------
 *
 *      File            BaseScene.js
 *      Ported By       Young-Hwan Mun
 *      Contact         yh.msw9@gmail.com
 * 
 * -----------------------------------------------------------------------------------
 *   
 *      Created By      ChildhoodAndy on 14-3-9    
 *
 * -----------------------------------------------------------------------------------
 * 
 *      Permission is hereby granted, free of charge, to any person obtaining a copy
 *      of this software and associated documentation files (the "Software"), to deal
 *      in the Software without restriction, including without limitation the rights
 *      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *      copies of the Software, and to permit persons to whom the Software is
 *      furnished to do so, subject to the following conditions:
 * 
 *      The above copyright notice and this permission notice shall be included in
 *      all copies or substantial portions of the Software.
 * 
 *      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *      THE SOFTWARE.
 *
 * ----------------------------------------------------------------------------------- */ 

var GRID_SPACE = 30;
var DRAG_BODYS_TAG = 0x80;

msw.BaseScene = cc.SceneEx.extend 
({
	ctor:function ( ) 
	{
		this._super ( );
		
		var		BG = new cc.LayerColor ( cc.color ( 128, 128, 128, 128 ) );
		this.addChild ( BG );

		// Grid
		var 	BGGrid = new cc.DrawNode ( );			
		for ( var i = 0; i < SCR_H; i += GRID_SPACE )
		{					
			BGGrid.drawSegment ( cc.p ( 0, i ), cc.p ( SCR_W, i ), 0.5, cc.color ( 0, 0, 0, 128 ) );
		}

		for ( var i = 0; i < SCR_W; i += GRID_SPACE )
		{
			BGGrid.drawSegment ( cc.p ( i, 0 ), cc.p ( i, SCR_H ), 0.5, cc.color ( 0, 0, 0, 128 ) );
		}
		this.addChild ( BGGrid );
		
		// Initialize Physics
		var		Size = cc.winSize;
		var 	Body = cc.PhysicsBody.createEdgeBox ( Size, cc.PHYSICSBODY_MATERIAL_DEFAULT, 7 );				
	    this.WallNode = new cc.NodeEx ( );
	    Body.setGroup ( 1 );
	    this.WallNode.setPosition ( Size.width / 2, Size.height / 2 );
	    this.WallNode.setPhysicsBody ( Body );
	    this.addChild ( this.WallNode );	
	    
	    this.DebugDraw = true;
	    this.getPhysicsWorld ( ).setDebugDrawMask ( cc.PhysicsWorld.DEBUGDRAW_ALL );
		
		var		Back = new cc.MenuItemImage ( "res/backNormal.png", "res/backSelected.png", this.back, this );
		var		Restart = new cc.MenuItemImage ( "res/refreshNormal.png", "res/refreshSelected.png", this.restart, this );
				
		cc.MenuItemFont.setFontSize ( 18 );
		var		ToggleDebug = new cc.MenuItemFont ( "Toggle debug", this.toggleDebug, this );

		Back.setPosition ( SCR_W - 110, SCR_H - 80 );
		Restart.setPosition ( SCR_W - 200, SCR_H - 80 );		
		ToggleDebug.setPosition ( SCR_W - 50, SCR_H - 10 );

		var		Menu = new cc.Menu ( Back, Restart, ToggleDebug );
		Menu.setPosition ( 0, 0 );
		this.addChild ( Menu, 10 );		
		
		var		Label = new cc.LabelTTF ( this.demo_info ( ), "Helvetica", 25 );
		Label.setAnchorPoint ( cc.p ( 0, 1.0 ) )
		Label.setPosition ( 60, SCR_H - 60 );				
		this.addChild ( Label, 10 );     
		
		this.IsTouchEnable = true;
		this.Mouses = new Array ( );
		cc.eventManager.addListener 
		({
			event : cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches : true,
			onTouchBegan : function ( touch, event ) 
			{
				var		target = event.getCurrentTarget ( );
				if ( target.IsTouchEnable )
				{
					return target.onTouchBegan ( touch );										
				}

				return false;
			},
			onTouchMoved : function ( touch, event ) 
			{
				var		target = event.getCurrentTarget ( );
				if ( target.IsTouchEnable )
				{
					target.onTouchMoved ( touch );
				}				
			},
			onTouchEnded : function ( touch, event ) 
			{
				var		target = event.getCurrentTarget ( );
				if ( target.IsTouchEnable )
				{
					target.onTouchEnded ( touch );
				}				
			}
		}, this );	
		
		this.scheduleUpdate ( );
	},

	demo_info:function ( )
	{
		return "";
	},
	
	setTouchEnabled:function ( Enable )
	{
		this.IsTouchEnable = Enable;
	},

	onTouchBegan:function ( Touch )
	{
	    var 	Location = Touch.getLocation ( );
	    var 	Shapes   = this.getPhysicsWorld ( ).getShapes ( Location );
	    
	    cc.log ( Shapes );
	    for ( var idx in Shapes )
	    {
	    	var		Shape = Shapes [ idx ];
	    	var		Body  = Shape.getBody ( );
	    	if ( ( Body.getTag ( ) & DRAG_BODYS_TAG ) != 0 )
	    	{
		        var 	Mouse = new cc.NodeEx ( );
		        Mouse.setPhysicsBody ( cc.PhysicsBody.create ( cc.PHYSICS_INFINITY, cc.PHYSICS_INFINITY ) );
		        Mouse.getPhysicsBody ( ).setDynamic ( false );
		        Mouse.setPosition ( Location );
		        this.addChild ( Mouse );
		        		        
		        var 	Joint = cc.PhysicsJointPin.create ( Mouse.getPhysicsBody ( ), Body, Location );
		        Joint.setMaxForce ( 5000.0 * Body.getMass ( ) );
		        this.getPhysicsWorld ( ).addJoint ( Joint );
		        		        
		        this.Mouses.push ( { key : Touch.getID ( ), value : Mouse } );		       
		        return true;
	    	}	    	
	    }
	    
	    return false;
	},	

	onTouchMoved:function ( Touch )
	{
		var		id = Touch.getID ( );
		for ( var i in this.Mouses )
		{
			var		Mouse = this.Mouses [ i ];
			if ( Mouse.key == id )
			{								
				Mouse.value.setPosition ( Touch.getLocation ( ) );
				break;
			}
			
		}
	},	

	onTouchEnded:function ( Touch )
	{
		var		id = Touch.getID ( );
		for ( var i in this.Mouses )
		{
			var		Mouse = this.Mouses [ i ];
			if ( Mouse.key == id )
			{
				this.removeChild ( Mouse.value );
				this.Mouses.splice ( i, 1 );
				break;				
			}
		}		
	},	
	
	back:function ( Sender )
	{
		cc.director.runScene ( new msw.ContentScene ( ) );
	},
	
	restart:function ( Sender )
	{

	},	
	
	toggleDebug:function ( Sender )
	{
		this.DebugDraw = !this.DebugDraw;	
		this.getPhysicsWorld ( ).setDebugDrawMask ( this.DebugDraw ? cc.PhysicsWorld.DEBUGDRAW_ALL : cc.PhysicsWorld.DEBUGDRAW_NONE );
	},	
	
	createBall:function ( Point, Radius, Material )
	{		
		/*
		var 	Body = new cp.Body ( 1, cp.momentForCircle ( 1, 0, Radius, cp.vzero ) );
		Body.setPos ( Point );	
		this.Space.addBody ( Body );
		
		var 	Shape = new cp.CircleShape ( Body, Radius, cp.vzero );
		Shape.setElasticity ( Material.Restitution );
        Shape.setFriction ( Material.Friction );
        this.Space.addShape ( Shape );
            
        var 	Ball = new cc.PhysicsSprite ( "res/ball.png" );
        Ball.setBody ( Body );	       
        Ball.setScale ( Radius / ( Ball.getContentSize ( ).width * 0.5 ) );
        Ball.setPosition ( Point );
        Ball.setTag ( DRAG_BODYS_TAG );
		
        return Ball;
        */
	},
	
	createBox:function ( Point, Size )
	{
		var 	Body = cc.PhysicsBody.createBox ( Size );
		Body.setTag ( DRAG_BODYS_TAG );
		
		var 	Box = new cc.SpriteEx ( "res/YellowSquare.png" );
		var		BoxSize = Box.getContentSize ( );	
		Box.setScale ( Size.width / BoxSize.width, Size.height / BoxSize.height );
		//var		Box = new cc.NodeEx ( );
		Box.setPhysicsBody ( Body );
		Box.setPosition ( Point );
		Box.setRotation ( cc.random0To1 ( ) * 360 );
		
		return Box;
	},
});
