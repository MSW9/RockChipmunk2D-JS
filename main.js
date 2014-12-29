/** ----------------------------------------------------------------------------------
 *
 *      File            main.js
 *      Ported By       Young-Hwan Mun
 *      Contact         yh.msw9@gmail.com
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

var msw = msw || {};

var SCR_W = 0;
var SCR_H = 0;

var SCR_W2 = 0;
var SCR_H2 = 0;

msw.rand = function ( )
{
	return parseInt ( Math.random ( ) * 0xffffff );
};

cc.game.onStart = function ( )
{
	cc.view.adjustViewPort ( true );
	cc.view.setDesignResolutionSize ( 960, 640, cc.ResolutionPolicy.EXACT_FIT );
	cc.view.resizeWithBrowserSize ( true );

	cc.LoaderScene.preload ( msw.RESOURCES, function ( ) 
	{
		SCR_W = cc.winSize.width;
		SCR_H = cc.winSize.height; 

		SCR_W2 = SCR_W / 2;
		SCR_H2 = SCR_H / 2;  
		
		cc.director.runScene ( new msw.IntroScene ( ) );
	}, this );
};

cc.game.run ( );