/** ----------------------------------------------------------------------------------
 *
 *      File            PRKitDemo.js
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

msw.PRKitDemo = cc.Scene.extend 
({
	ctor:function ( ) 
	{
		this._super ( );

		var		BG = new cc.LayerColor ( cc.color ( 128, 128, 128, 128 ) );
		this.addChild ( BG );
		
		var		Back = new cc.MenuItemImage ( "res/backNormal.png", "res/backSelected.png", this.back, this );
		var		Restart = new cc.MenuItemImage ( "res/refreshNormal.png", "res/refreshSelected.png", this.restart, this );
				
		Back.setPosition ( SCR_W - 110, SCR_H - 80 );
		Restart.setPosition ( SCR_W - 200, SCR_H - 80 );		
		
		var		Menu = new cc.Menu ( Back, Restart );
		Menu.setPosition ( 0, 0 );
		this.addChild ( Menu );		
		
		var		Label = new cc.LabelTTF ( this.demo_info ( ), "Helvetica", 25 );
		Label.setAnchorPoint ( cc.p ( 0, 1.0 ) )
		Label.setPosition ( 60, SCR_H - 60 );				
		this.addChild ( Label );  

		var		Points = 
		[
		  	100, 100,
		  	100, 100,
		  	200, 100,
		  	300, 200,
		  	400, 300,
		  	500, 500
		];
		
		var		Texture = cc.textureCache.addImage ( "res/PRKitDemo/pattern1.png" );

		var		FilledPolygon = new cc.PRFilledPolygon ( );
		FilledPolygon.initWithPoints ( Points, Texture );
		this.addChild ( FilledPolygon ); 		
	},
	
	demo_info:function ( )
	{
		return "12 PRKit Demo";
	},
	
	back:function ( Sender )
	{
		cc.director.runScene ( new msw.ContentScene ( ) );
	},
	
	restart:function ( Sender )
	{
		cc.director.runScene ( new msw.PRKitDemo ( ) );
	},		
});
