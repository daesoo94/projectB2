/**
 * @author Hakan Karlidag - @axaq
 */


/**
 * Main display object container class to hold all views
 * within the engine and all map related logic
 *
 * @class EngineView
 * @extends PIXI.Container
 * @constructor
 * @param config {Object} configuration object for the isometric engine instance
 * @param config.mapDataPath {String} the path to the xml file that defines map data, required
 */
TRAVISO.EngineView = function(config)
{
    PIXI.Container.call(this);
    
    /**
     * Configuration object for the isometric engine instance
     * 
     * @property {Object} config
     * @property {Number} config.minScale=0.5 mimimum scale that the PIXI.Container for the map can get, default 0.5
     * @property {Number} config.maxScale=1.5 maximum scale that the PIXI.Container for the map can get, default 1.5
     * @property {Number} config.minZoom=-1 minimum zoom level, engine defined
     * @property {Number} config.maxZoom=1 maximum zoom level, engine defined
     * @property {Number} config.zoomIncrement=0.5 zoom increment amount calculated by the engine according to user settings, default 0.5
     * @property {Number} config.numberOfZoomLevels=5 used to calculate zoom increment, defined by user, default 5
     * @property {Number} config.initialZoomLevel=0 initial zoom level of the map, default 0
     * @property {Number} config.instantCameraZoom=false specifies wheather to zoom instantly or with a tween animation, default false
     * 
     * @property {Number} config.tileHeight=74 height of a single isometric tile, default 74
     * @property {Number} config.isoAngle=30 the angle between the topleft edge and the horizontal diagonal of a isometric quad, default 30
     * 
     * @property {Object} config.initialPositionFrame frame to position the engine, default { x : 0, y : 0, w : 800, h : 600 }
     * @property {Number} config.initialPositionFrame.x x position of the engine, default 0
     * @property {Number} config.initialPositionFrame.y y position of the engine, default 0
     * @property {Number} config.initialPositionFrame.w width of the engine, default 800
     * @property {Number} config.initialPositionFrame.h height of the engine, default 600
     * 
     * @property {Number} config.pathFindingType=TRAVISO.pfAlgorithms.ASTAR_ORTHOGONAL the type of path finding algorithm two use, default TRAVISO.pfAlgorithms.ASTAR_ORTHOGONAL
     * @property {Boolean} config.pathFindingClosest=false whether to return the path to the closest node if the target is unreachable, default false
     * 
     * @property {Boolean} config.followCharacter=true defines if the camera will follow the current controllable or not, default true
     * @property {Boolean} config.instantCameraRelocation=false specifies wheather the camera moves instantly or with a tween animation to the target location, default false
     * @property {Boolean} config.instantObjectRelocation=false specifies wheather the map-objects will be moved to target location instantly or with an animation, default false
     * 
     * @property {Boolean} config.changeTransperancies=true make objects transparent when the cotrollable is behind them, default true
     * 
     * @property {Boolean} config.highlightPath=true highlight the path when the current controllable moves on the map, default true
     * @property {Boolean} config.highlightTargetTile=true highlight the target tile when the current controllable moves on the map, default true
     * @property {Boolean} config.tileHighlightAnimated=true animate the tile highlights, default true
     * @property {Number(Hexadecimal)} [config.tileHighlightFillColor=0x80d7ff] color code for the tile highlight fill (this will be overridden if a highlight-image is defined), default 0x80d7ff
     * @property {Number} [config.tileHighlightFillAlpha=0.5] apha value for the tile highlight fill (this will be overridden if a highlight-image is defined), default 0.5
     * @property {Number(Hexadecimal)} [config.tileHighlightStrokeColor=0xFFFFFF] color code for the tile highlight stroke (this will be overridden if a highlight-image is defined), default 0xFFFFFF
     * @property {Number} [config.tileHighlightStrokeAlpha=1.0] apha value for the tile highlight stroke (this will be overridden if a highlight-image is defined), default 1.0
     * @property {Boolean} config.dontAutoMoveToTile=false when a tile selected don't move the controllable immediately but still call 'tileSelectCallback', default false
     * @property {Boolean} config.checkPathOnEachTile=true looks for a path everytime an object moves to a new tile (set to false if you don't have other moving objects on your map), default true
     * 
     * @property {Boolean} config.mapDraggable=true enable dragging the map with touch-and-touchmove or mousedown-and-mousemove on the map, default true
     * 
     * @property {Number(Hexadecimal)} config.backgroundColor=null background color, if defined the engine will create a solid colored background for the map, default null
     * @property {Boolean} config.useMask=false creates a mask using the position frame defined by 'initialPositionFrame' property or the 'posFrame' parameter that is passed to 'repositionContent' method, default false
     * 
     * @property {String} config.mapDataPath the path to the xml file that defines map data, required
     * @property {Array(String)} config.assetsToLoad=null array of paths to the assets that are desired to be loaded by traviso, no need to use if assets are already loaded to PIXI cache, default null 
     * 
     * @property {Function} config.engineInstanceReadyCallback=null callback function that will be called once everything is loaded and engine instance is ready, default null
     * @property {Function} config.tileSelectCallback=null callback function that will be called when a tile is selected (call params will be the row and column indexes of the tile selected), default null
     * @property {Function} config.objectSelectCallback=null callback function that will be called when a tile with an interactive map-object on it is selected (call param will be the object selected), default null
     * @property {Function} config.objectReachedDestinationCallback=null callback function that will be called when any moving object reaches its destination (call param will be the moving object itself), default null
     * @property {Function} config.otherObjectsOnTheNextTileCallback=null callback function that will be called when any moving object is in move and there are other objects on the next tile, default null
     * @property {Function} config.objectUpdateCallback=null callback function that will be called everytime an objects direction or position changed, default null
     * 
     * @private
     */

    this.config = config || { };
    
    // set the properties that are set by default when not defined by the user
    this.config.followCharacter = TRAVISO.existy(this.config.followCharacter) ? this.config.followCharacter : true;
    this.config.changeTransperancies = TRAVISO.existy(this.config.changeTransperancies) ? this.config.changeTransperancies : true;
    this.config.highlightPath = TRAVISO.existy(this.config.highlightPath) ? this.config.highlightPath : true;
    this.config.highlightTargetTile = TRAVISO.existy(this.config.highlightTargetTile) ? this.config.highlightTargetTile : true;
    this.config.tileHighlightAnimated = TRAVISO.existy(this.config.tileHighlightAnimated) ? this.config.tileHighlightAnimated : true;
    this.config.tileHighlightFillColor = TRAVISO.existy(this.config.tileHighlightFillColor) ? this.config.tileHighlightFillColor : 0x80d7ff;
    this.config.tileHighlightFillAlpha = TRAVISO.existy(this.config.tileHighlightFillAlpha) ? this.config.tileHighlightFillAlpha : 0.5;
    this.config.tileHighlightStrokeColor = TRAVISO.existy(this.config.tileHighlightStrokeColor) ? this.config.tileHighlightStrokeColor : 0xFFFFFF;
    this.config.tileHighlightStrokeAlpha = TRAVISO.existy(this.config.tileHighlightStrokeAlpha) ? this.config.tileHighlightStrokeAlpha : 1.0;
    this.config.dontAutoMoveToTile = TRAVISO.existy(this.config.dontAutoMoveToTile) ? this.config.dontAutoMoveToTile : false;
    this.config.checkPathOnEachTile = TRAVISO.existy(this.config.checkPathOnEachTile) ? this.config.checkPathOnEachTile : true;
    this.config.mapDraggable = TRAVISO.existy(this.config.mapDraggable) ? this.config.mapDraggable : true;
    
    this.setZoomParameters(this.config.minScale, this.config.maxScale, this.config.numberOfZoomLevels, this.config.initialZoomLevel, this.config.instantCameraZoom);
    
    /**
     * height of a single isometric tile
     * @property {Number} TILE_H
     * @default 74
     * @private
     */
    /**
     * width of a single isometric tile
     * @property {Number} TILE_W
     * @default 128
     * @private
     */
    /**
     * the angle between the topleft edge and the horizontal diagonal of a isometric quad
     * @property {Number} ISO_ANGLE 
     * @default 30
     * @private
     */
    /**
     * half-height of a single isometric tile
     * @property {Number} TILE_HALF_H 
     * @default 37
     * @private
     */
    /**
     * half-width of a single isometric tile
     * @property {Number} TILE_HALF_W 
     * @default 64
     * @private
     */
    /**
     * length of a single isometric tile's edge
     * @property {Number} TILE_ISO_EDGE_L 
     * @default 74
     * @private
     */
    this.TILE_H = this.config.tileHeight || 74;
    //this.ISO_ANGLE = this.config.isoAngle || 30;
    this.TILE_HALF_H = this.TILE_H / 2;
    //this.TILE_HALF_W = this.TILE_HALF_H * Math.tan((90 - this.ISO_ANGLE) * Math.PI / 180);
    this.TILE_W = this.config.tileWidth || 74;
    this.TILE_HALF_W = this.TILE_W /2;
    this.TILE_ISO_EDGE_L = this.TILE_H;
    
    
    /** 
     * specifies wheather to zoom instantly or with a tween animation
     * @property {Boolean} instantCameraZoom 
     * @default false
     */
    /** 
     * defines if the camera will follow the current controllable or not
     * @property {Boolean} followCharacter 
     * @default true
     */
    /** 
     * specifies wheather the camera moves instantly or with a tween animation to the target location
     * @property {Boolean} instantCameraRelocation 
     * @default false
     */
    /** 
     * specifies wheather the map-objects will be moved to target location instantly or with an animation
     * @property {Boolean} instantObjectRelocation 
     * @default false
     */
    /** 
     * make objects transparent when the cotrollable is behind them
     * @property {Boolean} changeTransperancies 
     * @default true
     */ 
    /** 
     * highlight the path when the current controllable moves on the map
     * @property {Boolean} highlightPath 
     * @default true
     */
    /** 
     * highlight the target tile when the current controllable moves on the map
     * @property {Boolean} highlightTargetTile 
     * @default true
     */
    /** 
     * animate the tile highlights
     * @property {Boolean} tileHighlightAnimated 
     * @default true
     */
    /** 
     * when a tile selected don't move the controllable immediately but still call 'tileSelectCallback'
     * @property {Boolean} dontAutoMoveToTile 
     * @default false
     */
    /** 
     * engine looks for a path everytime an object moves to a new tile on the path
     * (set to false if you don't have moving objects other then your controllable on your map)
     * @property {Boolean} checkPathOnEachTile 
     * @default true
     */
    /** 
     * enable dragging the map with touch-and-touchmove or mousedown-and-mousemove on the map
     * @property {Boolean} mapDraggable 
     * @default true
     */
    /** 
     * callback function that will be called once everything is loaded and engine instance is ready
     * @property {Function} engineInstanceReadyCallback 
     * @default null
     */
    /** 
     * callback function that will be called when a tile is selected. Params will be the row and column indexes of the tile selected.
     * @property {Function} tileSelectCallback 
     * @default null
     */
    /** 
     * callback function that will be called when a tile with an interactive map-object on it is selected. Call param will be the object selected.
     * @property {Function} objectSelectCallback 
     * @default null
     */
    /** 
     * callback function that will be called when any moving object reaches its destination. Call param will be the moving object itself.
     * @property {Function} objectReachedDestinationCallback 
     * @default null
     */
    /** 
     * callback function that will be called when any moving object is in move and there are other objects on the next tile. Call params will be the moving object and an array of objects on the next tile.
     * @property {Function} otherObjectsOnTheNextTileCallback 
     * @default null
     */
    /** 
     * callback function that will be called everytime an objects direction or position changed
     * @property {Function} objectUpdateCallback 
     * @default null
     */
    
    // TRAVISO.loadAssetsAndData(this, this.onAllAssetsLoaded.bind(this));
};

// constructor
TRAVISO.EngineView.constructor = TRAVISO.EngineView;
TRAVISO.EngineView.prototype = Object.create(PIXI.Container.prototype);

TRAVISO.EngineView.prototype.config = this.config;



/**
 * This method is being called whenever all the assets are
 * loaded and engine is ready to initialize
 *
 * @method onAllAssetsLoaded
 * @private
 */
TRAVISO.EngineView.prototype.onAllAssetsLoaded = function()
{
    TRAVISO.trace("onAllAssetsLoaded");
    
    /**
     * MoveEngine instance to handle all animations and tweens
     * @property {MoveEngine} moveEngine
     * @private
     */
    
    this.moveEngine = new TRAVISO.MoveEngine(this);
    
    /**
     * Current scale of the map's display object
     * @property {Number} currentScale
     * @private
     */
    /**
     * Current zoom amount of the map
     * @property {Number} currentZoom
     * @private
     */
    
    this.currentScale = 1.0;
    this.currentZoom = 0;
    
    this.posFrame = this.config.initialPositionFrame || { x : 0, y : 0, w : 800, h : 600 };

    this.externalCenter =
    {
        x : this.posFrame.w >> 1,
        y : this.posFrame.h >> 1
    };
    
    
    this.createMap();

    this.repositionContent(this.config.initialPositionFrame);
    
    this.enableInteraction();
    
    if (this.config.engineInstanceReadyCallback) { this.config.engineInstanceReadyCallback(this); }
};

/**
 * Creates the map and setups necessary parameters for future map calculations 
 *
 * @method createMap
 * @private
 */
TRAVISO.EngineView.prototype.createMap = function()
{
    // create background
	if (this.config.backgroundColor)
    {
    	/**
	     * Solid colored background
	     * @property {PIXI.Graphics} bg
	     * @private
	     */
        this.bg = new PIXI.Graphics();
        this.addChild(this.bg);
    }
    
    // create mask
    if (this.config.useMask)
    {
    	/**
	     * Mask graphics for the mask
	     * @property {PIXI.Graphics} mapMask
	     * @private
	     */
        this.mapMask = new PIXI.Graphics();
        this.addChild(this.mapMask);
    }
    
    /**
     * Display object for the map visuals
     * @property {PIXI.Container} mapContainer
     * @private
     */
    /**
     * Display object for the ground/terrain visuals
     * @property {PIXI.Container} groundContainer
     * @private
     */
    /**
     * Display object for the map-object visuals
     * @property {PIXI.Container} objContainer
     * @private
     */
    // create containers for visual map elements
    this.mapContainer = new PIXI.Container();
	this.addChild(this.mapContainer);
    
    // Define two layers of maps
	// One for the world and one for the objects (static/dynamic) over it
	// This enables us not to update the whole world in every move but instead just update the object depths over it 
	
	this.groundContainer = new PIXI.Container();
	this.mapContainer.addChild(this.groundContainer);
	
	this.objContainer = new PIXI.Container();
	this.mapContainer.addChild(this.objContainer);
	
	var groundMapData = this.mapData.groundMapData;
    var objectsMapData = this.mapData.objectsMapData;
    
    var initialControllableLocation = this.mapData.initialControllableLocation;
    
    // set map size
    
    /**
     * Number of rows in the isometric map
     * @property {Number} mapSizeR 
     */
    this.mapSizeR = groundMapData.length;
    /**
     * Number of columns in the isometric map
     * @property {Number} mapSizeC 
     */
    this.mapSizeC = groundMapData[0].length;
	
	// add ground image first if it is defined
	var groundImageSprite;
	if (this.mapData.singleGroundImage)
	{
	    groundImageSprite = new PIXI.Sprite.fromFrame(this.mapData.singleGroundImage.path);
	    this.groundContainer.addChild(groundImageSprite);
	    
	    groundImageSprite.scale.set(this.mapData.singleGroundImage.scale || 1);
        
        this.groundImageSprite = groundImageSprite;
	}
	
	// create arrays to hold tiles and objects
	/**
     * Array to hold map-tiles
     * @property {Array(Array(TileView))} tileArray
     * @private
     */
	this.tileArray = [];
	/**
     * Array to hold map-objects
     * @property {Array(Array(ObjectView))} objArray
     * @private
     */
	this.objArray = [];
	var i, j;
	for (i = 0; i < this.mapSizeR; i++)
	{
		this.tileArray[i] = [];
		this.objArray[i] = [];
	    for (j = 0; j < this.mapSizeC; j++)
	    {
	    	this.tileArray[i][j] = null;
	    	this.objArray[i][j] = null;
	    }
	}
	
	
	// Map data is being sent to path finding and after this point 
	// its content will be different acc to the pathfinding algorithm.
	// It is still being stored in engine.mapData but you must be aware
	// of the structure if you want to use it after this point.
	/**
     * PathFinding instance to handle all path finding logic
     * @property {PathFinding} pathFinding
     * @private
     */
	this.pathFinding = new TRAVISO.PathFinding(
        this.mapSizeC, 
        this.mapSizeR,
        {
            diagonal: this.config.pathFindingType === TRAVISO.pfAlgorithms.ASTAR_DIAGONAL,
            closest: this.config.pathFindingClosest
        }
    );
	
   
	
	var tile;
	for (i = 0; i < this.mapSizeR; i++)
	{
	    for (j = this.mapSizeC-1; j >= 0; j--)
	    {
	    	this.tileArray[i][j] = null;
	    	if (groundMapData[i][j])
	    	{
		    	tile = new TRAVISO.TileView(this, groundMapData[i][j]);
		    	tile.position.x = this.getTilePosXFor(i,j);
		    	tile.position.y = this.getTilePosYFor(i,j);
		    	tile.mapPos = { c:j, r:i };
		    	this.tileArray[i][j] = tile;
		    	this.groundContainer.addChild(tile);
		    	
		    	
		    	if (!tile.isMovableTo)
		    	{
		    		this.pathFinding.setCell(j,i,0);
		    	}
		    }
		    else
		    {
		    	this.pathFinding.setCell(j,i,0);
		    }
		}
	}
	
	/**
     * Current controllable map-object that will be the default object to move in user interactions 
     * @property {ObjectView} currentControllable
     * @private
     */
    
	var obj,
        floorObjectFound = false;
	for (i = 0; i < this.mapSizeR; i++)
	{
	    for (j = this.mapSizeC-1; j >= 0; j--)
	    {
	    	this.objArray[i][j] = null;
	    	if (objectsMapData[i][j])
	    	{
		    	obj = new TRAVISO.ObjectView(this, objectsMapData[i][j]);
		    	obj.position.x = this.getTilePosXFor(i,j);
		    	obj.position.y = this.getTilePosYFor(i,j);// + this.TILE_HALF_H;
		    	obj.mapPos = { c:j, r:i };
                
                if (!floorObjectFound && obj.isFloorObject) { floorObjectFound = true; }
		    	
		    	this.objContainer.addChild(obj);
		    	
		    	this.addObjRefToLocation(obj, obj.mapPos);
		    	
		    	// if (initialControllableLocation && initialControllableLocation.c === j && initialControllableLocation.r === i)
		    	if (initialControllableLocation && initialControllableLocation.columnIndex === j && initialControllableLocation.rowIndex === i)
		    	{
		    		this.currentControllable = obj;
		    	}
		    }
		}
	}
    if (floorObjectFound)
    {
        // run the loop again to bring the other objects on top of the floor objects
        var a, k;
        for (i = 0; i < this.mapSizeR; i++)
    	{
    	    for (j = this.mapSizeC-1; j >= 0; j--)
    	    {
    	    	a = this.objArray[i][j];
    	    	if (a)
    	    	{
    	    	    for (k=0; k < a.length; k++)
    	    	    {
    				    if (!a[k].isFloorObject) { this.objContainer.addChild(a[k]); }
    				}
    		    }
    		}
    	}
	}
	// cacheAsBitmap: for now this creates problem with tile highlights
	// this.groundContainer.cacheAsBitmap = true;
	
	/**
     * Vertice points of the map
     * @property {Array(Array(Number))} mapVertices
     * @private
     */
	this.mapVertices = [
						[this.getTilePosXFor(0,0) - this.TILE_HALF_W, this.getTilePosYFor(0,0)],
						[this.getTilePosXFor(0,this.mapSizeC - 1), this.getTilePosYFor(0,this.mapSizeC - 1) - this.TILE_HALF_H],
						[this.getTilePosXFor(this.mapSizeR - 1,this.mapSizeC - 1) + this.TILE_HALF_W, this.getTilePosYFor(this.mapSizeR - 1,this.mapSizeC - 1)],
						[this.getTilePosXFor(this.mapSizeR - 1,0), this.getTilePosYFor(this.mapSizeR - 1,0) + this.TILE_HALF_H]
					];
	
	/**
     * Total width of all ground tiles  
     * @property {Number} mapVisualWidthReal
     * @private
     */
    /**
     * Total height of all ground tiles  
     * @property {Number} mapVisualHeightReal
     * @private
     */ 	
	this.mapVisualWidthReal = this.getTilePosXFor(this.mapSizeR - 1,this.mapSizeC - 1) - this.getTilePosXFor(0,0);
	this.mapVisualHeightReal = this.getTilePosYFor(this.mapSizeR - 1,0) - this.getTilePosYFor(0,this.mapSizeC - 1);
	
	if (groundImageSprite)
	{
	    groundImageSprite.position.x = this.mapVertices[0][0] + this.TILE_HALF_W + (this.mapVisualWidthReal -  groundImageSprite.width) / 2;
	    groundImageSprite.position.y = this.mapVertices[1][1] + this.TILE_HALF_H + (this.mapVisualHeightReal -  groundImageSprite.height) / 2;
	}
	
	this.zoomTo(this.config.initialZoomLevel, true);
	
	if (this.config.followCharacter && initialControllableLocation)
	{
		// this.centralizeToLocation(initialControllableLocation.c, initialControllableLocation.r, true);
		this.centralizeToLocation(initialControllableLocation.columnIndex, initialControllableLocation.rowIndex, true);
	}
	else
	{
		this.centralizeToCurrentExternalCenter(true);
	}
};

/**
 * Calculates 2d x position of a tile 
 *
 * @method getTilePosXFor
 * @param r {Number} row index of the tile
 * @param c {Number} column index of the tile
 * @return {Number} 2d x position of a tile
 */
TRAVISO.EngineView.prototype.getTilePosXFor = function(r,c)
{
    return (c * this.TILE_HALF_W) + (r * this.TILE_HALF_W);
};
/**
 * Calculates 2d y position of a tile 
 *
 * @method getTilePosYFor
 * @param r {Number} row index of the tile
 * @param c {Number} column index of the tile
 * @return {Number} 2d y position of a tile 
 */
TRAVISO.EngineView.prototype.getTilePosYFor = function(r,c)
{
    return (r * this.TILE_HALF_H) - (c * this.TILE_HALF_H);
};

/**
 * Shows or hides the display object that includes the objects-layer
 *
 * @method showHideObjectLayer
 * @param show=false {Boolean} 
 */
TRAVISO.EngineView.prototype.showHideObjectLayer = function(show)
{
    this.objContainer.visible = show;
};
/**
 * Shows or hides the display object that includes the ground/terrain layer
 *
 * @method showHideGroundLayer
 * @param show=false {Boolean} 
 */
TRAVISO.EngineView.prototype.showHideGroundLayer = function(show)
{
    this.groundContainer.visible = show;
};

/**
 * Returns the TileView instance that sits in the location given  
 *
 * @method getTileAtRowAndColumn
 * @param r {Number} row index of the tile
 * @param c {Number} column index of the tile
 * @return {TileView} the tile in the location given
 */
TRAVISO.EngineView.prototype.getTileAtRowAndColumn = function(r,c) 
{
    return this.tileArray[r][c];
};
/**
 * Returns all the ObjectView instances referenced to the given location with the specified row and column indexes.
 *
 * @method getObjectsAtRowAndColumn
 * @param r {Number} the row index of the map location
 * @param c {Number} the column index of the map location
 * @return {Array(ObjectView)} an array of map-objects referenced to the given location
 */
TRAVISO.EngineView.prototype.getObjectsAtRowAndColumn = function(r,c) 
{
    return this.objArray[r][c];
};
/**
 * Returns all the ObjectView instances referenced to the given location.
 *
 * @method getObjectsAtLocation
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 * @return {Array(ObjectView)} an array of map-objects referenced to the given location
 */
TRAVISO.EngineView.prototype.getObjectsAtLocation = function(pos) 
{
    return this.objArray[pos.r][pos.c];
};

/**
 * Creates and adds a predefined (in XML file) map-object to the map using the specified object type-id.
 *
 * @method createAndAddObjectToLocation
 * @param type {Number} type-id of the object as defined in the XML file
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 * @return {ObjectView} the newly created map-object
 */
TRAVISO.EngineView.prototype.createAndAddObjectToLocation = function(type, pos) 
{
	return this.addObjectToLocation(new TRAVISO.ObjectView(this, type), pos);
};

/**
 * Adds an already-created object to the map.
 *
 * @method addObjectToLocation
 * @param obj {Object} either an external display object or a map-object (ObjectView)
 * @param obj.isMovableTo {Boolean} if the object can be moved onto by other map-objects
 * @param obj.columnSpan {Number} number of tiles that map-object covers horizontally on the isometric map
 * @param obj.rowSpan {Number} number of tiles that map-object covers vertically on the isometric map
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 * @return {Object} the newly added object
 */
TRAVISO.EngineView.prototype.addObjectToLocation = function(obj, pos) {
	obj.position.x = this.getTilePosXFor(pos.r,pos.c);
	obj.position.y = this.getTilePosYFor(pos.r,pos.c) + this.TILE_HALF_H;
	obj.mapPos = { c:pos.c, r:pos.r };
	
	this.objContainer.addChild(obj);
	
	this.addObjRefToLocation(obj, obj.mapPos);
	this.arrangeDepthsFromLocation(obj.isFloorObject ? { c: this.mapSizeC-1, r: 0 } : obj.mapPos);
	
	return obj;
};

/**
 * Enables adding external custom display objects to the specified location.
 * This method should be used for the objects that are not already defined in XML file and don't have a type-id.
 * The resulting object will be independent of engine mechanics apart from depth controls.
 *
 * @method addCustomObjectToLocation
 * @param displayObject {PIXI.DisplayObject} object to be added to location
 * @param [displayObject.isMovableTo=true] {Boolean} if the object can be moved onto by other map-objects, default true
 * @param [displayObject.columnSpan] {Number} number of tiles that map-object covers horizontally on the isometric map
 * @param [displayObject.rowSpan] {Number} number of tiles that map-object covers vertically on the isometric map
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 * @return {Object} the newly added object
 */
TRAVISO.EngineView.prototype.addCustomObjectToLocation = function(displayObject, pos) {
	displayObject.isMovableTo = TRAVISO.existy(displayObject.isMovableTo) ? displayObject.isMovableTo : true;
	displayObject.columnSpan = displayObject.columnSpan || 1;
	displayObject.rowSpan = displayObject.rowSpan || 1;
	
	return this.addObjectToLocation(displayObject, pos);
	
	// this.removeObjRefFromLocation(displayObject, pos);
};

/**
 * Removes the object and its references from the map.
 *
 * @method removeObjectFromLocation
 * @param obj {Object} either an external display object or a map-object (ObjectView)
 * @param [pos=null] {Object} object including r and c coordinates, if not defined the engine will use 'obj.mapPos' to remove the map-object
 * @param [pos.r] {Number} the row index of the map location
 * @param [pos.c] {Number} the column index of the map location
 */
TRAVISO.EngineView.prototype.removeObjectFromLocation = function(obj, pos) {
	pos = pos || obj.mapPos;
	this.objContainer.removeChild(obj);
	this.removeObjRefFromLocation(obj, pos);
};

/**
 * Centralizes and zooms the EngineView instance to the object specified.
 *
 * @method focusMapToObject
 * @param obj {ObjectView} the object that map will be focused with respect to
 * @param obj.mapPos {Object} the object that holds the location of the map-object on the map
 * @param obj.mapPos.c {Number} the column index of the map location
 * @param obj.mapPos.r {Number} the row index of the map location
 * @param obj.columnSpan {Number} number of tiles that map-object covers horizontally on the isometric map
 * @param obj.rowSpan {Number} number of tiles that map-object covers vertically on the isometric map
 */
TRAVISO.EngineView.prototype.focusMapToObject = function(obj) {
	this.focusMapToLocation(obj.mapPos.c + (obj.columnSpan - 1) / 2, obj.mapPos.r - (obj.rowSpan - 1) / 2, 0);
};

/**
 * Centralizes and zooms the EngineView instance to the map location specified by row and column index.
 *
 * @method focusMapToLocation
 * @param c {Number} the column index of the map location
 * @param r {Number} the row index of the map location
 * @param zoomAmount {Number} targeted zoom level for focusing
 */
TRAVISO.EngineView.prototype.focusMapToLocation = function(c, r, zoomAmount) {
	// NOTE: using zoomTo instead of setScale causes centralizeToPoint to be called twice (no visual problem)
	this.zoomTo(zoomAmount, false);
	this.centralizeToLocation(c,r);
};

/**
 * Centralizes the EngineView instance to the object specified.
 *
 * @method centralizeToObject
 * @param obj {ObjectView} the object that map will be centralized with respect to
 * @param obj.mapPos {Object} the object that holds the location of the map-object on the map
 * @param obj.mapPos.c {Number} the column index of the map location
 * @param obj.mapPos.r {Number} the row index of the map location
 */
TRAVISO.EngineView.prototype.centralizeToObject = function(obj) {
	this.centralizeToLocation(obj.mapPos.c, obj.mapPos.r);
};

/**
 * Centralizes the EngineView instance to the map location specified by row and column index.
 *
 * @method centralizeToLocation
 * @param c {Number} the column index of the map location
 * @param r {Number} the row index of the map location
 * @param [instantRelocate=false] {Boolean} specifies if the camera move will be animated or instant
 */
TRAVISO.EngineView.prototype.centralizeToLocation = function(c, r, instantRelocate)
{
    this.currentFocusLocation = { c: c, r: r };
	var px = this.externalCenter.x + (this.mapVisualWidthScaled >> 1) - this.getTilePosXFor(r,c) * this.currentScale;
	var py = this.externalCenter.y - this.getTilePosYFor(r,c) * this.currentScale;
	this.centralizeToPoint(px, py, instantRelocate);
};

/**
 * Centralizes the EngineView instance to the current location of the attention/focus.
 *
 * @method centralizeToCurrentFocusLocation
 * @param [instantRelocate=false] {Boolean} specifies if the camera move will be animated or instant
 */
TRAVISO.EngineView.prototype.centralizeToCurrentFocusLocation = function(instantRelocate)
{
    this.centralizeToLocation(this.currentFocusLocation.c, this.currentFocusLocation.r, instantRelocate);
};


/**
 * External center is the central point of the frame defined by the user to be used as the visual size of the engine.
 * This method centralizes the EngineView instance with respect to this external center-point.
 *
 * @method centralizeToCurrentExternalCenter
 * @param [instantRelocate=false] {Boolean} specifies if the camera move will be animated or instant
 */
TRAVISO.EngineView.prototype.centralizeToCurrentExternalCenter = function(instantRelocate)
{
	if (this.externalCenter)
	{
		this.currentFocusLocation = { c: this.mapSizeC >> 1, r: this.mapSizeR >> 1 };
		this.centralizeToPoint(this.externalCenter.x, this.externalCenter.y, instantRelocate);
	}
};

/**
 * Centralizes the EngineView instance to the points specified.
 *
 * @method centralizeToPoint
 * @param px {Number} the x coordinate of the center point with respect to EngineView frame
 * @param py {Number} the y coordinate of the center point with respect to EngineView frame
 * @param [instantRelocate=false] {Boolean} specifies if the relocation will be animated or instant
 */
TRAVISO.EngineView.prototype.centralizeToPoint = function(px, py, instantRelocate)
{
	if (this.tileArray)
	{
		px = px - (this.mapVisualWidthScaled >> 1);
		if ((TRAVISO.existy(instantRelocate) && instantRelocate) || (!TRAVISO.existy(instantRelocate) && this.config.instantCameraRelocation))
		{
			this.mapContainer.position.x = px;
			this.mapContainer.position.y = py;
		}
		else
		{
			this.moveEngine.addTween(this.mapContainer.position, 0.5, { x: px, y: py }, 0, "easeInOut", true );
		}
	}
};

/**
 * Sets all the parameters related to zooming in and out.
 *
 * @method setZoomParameters
 * @param [minScale=0.5] {Number} mimimum scale that the PIXI.Container for the map can get, default 0.5
 * @param [maxScale=1.5] {Number} maximum scale that the PIXI.Container for the map can get, default 1.5
 * @param [numberOfZoomLevels=5] {Number} used to calculate zoom increment, defined by user, default 5
 * @param [initialZoomLevel=0] {Number} initial zoom level of the map, default 0
 * @param [instantCameraZoom=false] {Boolean} specifies wheather to zoom instantly or with a tween animation, default false
 */
TRAVISO.EngineView.prototype.setZoomParameters = function(minScale, maxScale, numberOfZoomLevels, initialZoomLevel, instantCameraZoom)
{
	this.config.minScale = TRAVISO.existy(minScale) ? minScale : 0.5;
	this.config.maxScale = TRAVISO.existy(maxScale) ? maxScale : 1.5;
    this.config.minZoom = -1;
    this.config.maxZoom = 1;
    this.config.zoomIncrement = TRAVISO.existy(numberOfZoomLevels) ? (numberOfZoomLevels <= 1 ? 0 : 2 / (numberOfZoomLevels - 1)) : 0.5;
	
	this.config.initialZoomLevel = TRAVISO.existy(initialZoomLevel) ? initialZoomLevel : 0;
	this.config.instantCameraZoom = TRAVISO.existy(instantCameraZoom) ? instantCameraZoom : false;
};

/**
 * Sets map's scale. 
 *
 * @method setScale
 * @private
 * @param s {Number} scale amount for both x and y coordinates
 * @param [instantZoom=false] {Boolean} specifies if the scaling will be animated or instant
 */
TRAVISO.EngineView.prototype.setScale = function(s, instantZoom)
{
	if (s < this.config.minScale) { s = this.config.minScale; }
	else if (s > this.config.maxScale) { s = this.config.maxScale; }
	this.currentScale = s;
	this.mapVisualWidthScaled = this.mapVisualWidthReal * this.currentScale;
	this.mapVisualHeightScaled = this.mapVisualHeightReal * this.currentScale;
	
	if ((TRAVISO.existy(instantZoom) && instantZoom) || (!TRAVISO.existy(instantZoom) && this.config.instantCameraZoom))
	{
		this.mapContainer.scale.set(this.currentScale);
	}
	else
	{
		this.moveEngine.addTween(this.mapContainer.scale, 0.5, { x: this.currentScale, y: this.currentScale }, 0, "easeInOut", true );
	}
};

/**
 * Zooms camera by to the amount given.
 *
 * @method zoomTo
 * @param zoomAmount {Number} specifies zoom amount (between -1 and 1). Use -1, -0.5, 0, 0,5, 1 for better results.
 * @param [instantZoom=false] {Boolean} specifies wheather to zoom instantly or with a tween animation
 */
TRAVISO.EngineView.prototype.zoomTo = function(zoomAmount, instantZoom)
{
    zoomAmount = zoomAmount || 0;
    var s = TRAVISO.mathMap(zoomAmount, this.config.minZoom, this.config.maxZoom, this.config.minScale, this.config.maxScale, true);
	s = Math.round(s * 10) / 10;
	
	this.currentZoom = TRAVISO.mathMap(s, this.config.minScale, this.config.maxScale, this.config.minZoom, this.config.maxZoom, true);
	
	this.externalCenter = this.externalCenter ? this.externalCenter : { x: (this.mapVisualWidthScaled >> 1), y: 0 };
	var diff = { x: this.mapContainer.position.x + (this.mapVisualWidthScaled >> 1) - this.externalCenter.x, y: this.mapContainer.position.y - this.externalCenter.y };
	var oldScale = this.currentScale;
	
	this.setScale(s, instantZoom);
	
	var ratio = this.currentScale / oldScale;
	this.centralizeToPoint(this.externalCenter.x + diff.x * ratio, this.externalCenter.y + diff.y * ratio, (TRAVISO.existy(instantZoom) && instantZoom) || (!TRAVISO.existy(instantZoom) && this.config.instantCameraZoom));
	
	// TRAVISO.trace("scalingTo: " + this.currentScale);
	// TRAVISO.trace("zoomingTo: " + this.currentZoom);
};

/**
 * Zooms the camera one level out.
 *
 * @method zoomOut
 * @param [instantZoom=false] {Boolean} specifies wheather to zoom instantly or with a tween animation
 */
TRAVISO.EngineView.prototype.zoomOut = function(instantZoom) 
{
	this.zoomTo(this.currentZoom - this.config.zoomIncrement, instantZoom);
};

/**
 * Zooms the camera one level in.
 *
 * @method zoomIn
 * @param [instantZoom=false] {Boolean} specifies wheather to zoom instantly or with a tween animation
 */
TRAVISO.EngineView.prototype.zoomIn = function(instantZoom) 
{
	this.zoomTo(this.currentZoom + this.config.zoomIncrement, instantZoom);
};

/**
 * Returns the current controllable map-object.  
 *
 * @method getCurrentControllable
 * @return {ObjectView} current controllable map-object
 */
TRAVISO.EngineView.prototype.getCurrentControllable = function()
{
    return this.currentControllable;
};

/**
 * Sets a map-object as the current controllable. This object will be moving in further relevant user interactions.  
 *
 * @method setCurrentControllable
 * @param obj {ObjectView} object to be set as current controllable
 * @param obj.mapPos {Object} object including r and c coordinates
 * @param obj.mapPos.c {Number} the column index of the map location
 * @param obj.mapPos.r {Number} the row index of the map location
 */
TRAVISO.EngineView.prototype.setCurrentControllable = function(obj)
{
    this.currentControllable = obj;
};

/**
 * Adds a reference of the given map-object to the given location in the object array.
 * This should be called when an object moved or transfered to the corresponding location.
 * Uses objects size property to add its reference to all relevant cells.
 *
 * @private
 * @method addObjRefToLocation
 * @param obj {ObjectView} object to be bind to location
 * @param obj.columnSpan {Number} number of tiles that map-object covers horizontally on the isometric map
 * @param obj.rowSpan {Number} number of tiles that map-object covers vertically on the isometric map
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 */
TRAVISO.EngineView.prototype.addObjRefToLocation = function(obj, pos) {
    var k, m;
	for (k = pos.c; k < pos.c + obj.columnSpan; k++) {
		for (m = pos.r; m > pos.r - obj.rowSpan; m--) {
			this.addObjRefToSingleLocation(obj, { c: k, r: m });
		}
	}
};
/**
 * Adds a reference of the given map-object to the given location in the object array.
 * Updates the cell as movable or not according to the object being movable onto or not.
 *
 * @private
 * @method addObjRefToSingleLocation
 * @param obj {ObjectView} object to be bind to location
 * @param obj.isMovableTo {Boolean} is the object is movable onto by the other objects or not
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 */
TRAVISO.EngineView.prototype.addObjRefToSingleLocation = function(obj, pos) 
{
    if (!this.objArray[pos.r][pos.c]) { this.objArray[pos.r][pos.c] = []; }
    var index = this.objArray[pos.r][pos.c].indexOf(obj);
    if (index < 0) { this.objArray[pos.r][pos.c].push(obj); }
    
    if (!obj.isMovableTo)
    {
    	this.pathFinding.setDynamicCell(pos.c,pos.r,0);
    }
};
/**
 * Removes references of the given map-object from the given location in the object array.
 * This should be called when an object moved or transfered from the corresponding location.
 * Uses objects size property to remove its references from all relevant cells.
 *
 * @private
 * @method removeObjRefFromLocation
 * @param obj {ObjectView} object to be bind to location
 * @param obj.columnSpan {Number} number of tiles that map-object covers horizontally on the isometric map
 * @param obj.rowSpan {Number} number of tiles that map-object covers vertically on the isometric map
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 */
TRAVISO.EngineView.prototype.removeObjRefFromLocation = function(obj, pos) {
    var k, m;
	for (k = pos.c; k < pos.c + obj.columnSpan; k++) {
		for (m = pos.r; m > pos.r - obj.rowSpan; m--) {
			this.removeObjRefFromSingleLocation(obj, { c: k, r: m });
		}
	}
};
/**
 * Removes a reference of the given map-object from the given location in the object array.
 * Updates the cell as movable or not according to the other object refences in the same cell.
 *
 * @private
 * @method removeObjRefFromSingleLocation
 * @param obj {ObjectView} object to be bind to location
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 */
TRAVISO.EngineView.prototype.removeObjRefFromSingleLocation = function(obj, pos) 
{
    if (this.objArray[pos.r][pos.c])
    {
        var index = this.objArray[pos.r][pos.c].indexOf(obj);
        if (index > -1) { this.objArray[pos.r][pos.c].splice(index, 1); }
        if (this.objArray[pos.r][pos.c].length === 0)
        {
        	this.pathFinding.setDynamicCell(pos.c,pos.r,1);
        	this.objArray[pos.r][pos.c] = null;
        }
        else
        {
        	var a = this.objArray[pos.r][pos.c];
		    var l = a.length;
	        for (var i=0; i < l; i++)
	        {
	            if (!a[i].isMovableTo)
	    		{	
		    		this.pathFinding.setDynamicCell(pos.c,pos.r,0);
		    		break;
		    	}
		    	else if (i === l-1)
		    	{
		    		this.pathFinding.setDynamicCell(pos.c,pos.r,1);
		    	}
	        }
        }
    }
};
/**
 * Removes all map-object references from the given location in the object array.
 *
 * @private
 * @method removeAllObjectRefsFromLocation
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 */
TRAVISO.EngineView.prototype.removeAllObjectRefsFromLocation = function(pos) 
{
    if (this.objArray[pos.r][pos.c])
    {
    	this.pathFinding.setDynamicCell(pos.c,pos.r,1);
        this.objArray[pos.r][pos.c] = null;
    }
};

/**
 * Sets alphas of the map-objects referenced to the given location.
 *
 * @method changeObjAlphasInLocation
 * @param value {Number} alpha value, should be between 0 and 1
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 */
TRAVISO.EngineView.prototype.changeObjAlphasInLocation = function(value, pos) 
{
    var a = this.objArray[pos.r][pos.c];
    if (a)
    {
        var l = a.length;
        for (var i=0; i < l; i++)
        {
            if (!a[i].isFloorObject && !a[i].noTransparency) { a[i].alpha = value; }
        }
    }
};

/**
 * Sets a map-abjects' location and logically moves it to the new location.
 *
 * @private
 * @method arrangeObjLocation
 * @param obj {ObjectView} map-object to be moved
 * @param obj.mapPos {Object} object including r and c coordinates
 * @param obj.mapPos.c {Number} the column index of the map location
 * @param obj.mapPos.r {Number} the row index of the map location
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 */
TRAVISO.EngineView.prototype.arrangeObjLocation = function(obj, pos) 
{
	this.removeObjRefFromLocation(obj, obj.mapPos);
	this.addObjRefToLocation(obj, pos);
	
	obj.mapPos = { c:pos.c, r:pos.r };
};

/**
 * Sets occlusion transperancies according to given map-object's location.
 * This method only works for user-controllable object. 
 *
 * @private
 * @method arrangeObjTransperancies
 * @param obj {ObjectView} current controllable map-object
 * @param prevPos {Object} previous location of the map-object
 * @param prevPos.r {Number} the row index of the map location
 * @param prevPos.c {Number} the column index of the map location
 * @param pos {Object} new location of the map-object
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 */
TRAVISO.EngineView.prototype.arrangeObjTransperancies = function(obj, prevPos, pos) 
{
    if (this.config.changeTransperancies)
    {
        if (this.currentControllable === obj)
        {
        	if (prevPos.c > 0) { this.changeObjAlphasInLocation(1, { c: prevPos.c-1, r: prevPos.r }); }
            if (prevPos.c > 0 && prevPos.r < this.mapSizeR-1) { this.changeObjAlphasInLocation(1, { c: prevPos.c-1, r: prevPos.r+1 }); }
            if (prevPos.r < this.mapSizeR-1) { this.changeObjAlphasInLocation(1, { c: prevPos.c, r: prevPos.r+1 }); }
    	
        	if (pos.c > 0) { this.changeObjAlphasInLocation(0.7, { c: pos.c-1, r: pos.r }); }
            if (pos.c > 0 && pos.r < this.mapSizeR-1) { this.changeObjAlphasInLocation(0.7, { c: pos.c-1, r: pos.r+1 }); }
            if (pos.r < this.mapSizeR-1) { this.changeObjAlphasInLocation(0.7, { c: pos.c, r: pos.r+1 }); }
        }
    	
    	// TODO: check if there is a way not to update main character alpha each time
    	obj.alpha = 1;
    }
};

/**
 * Arranges depths (z-index) of the map-objects starting from the given location.  
 *
 * @private
 * @method arrangeDepthsFromLocation
 * @param pos {Object} location object including the map coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 */
TRAVISO.EngineView.prototype.arrangeDepthsFromLocation = function(pos) 
{
    var a, i, j, k;
	for (i = pos.r; i < this.mapSizeR; i++)
	{
	    for (j = pos.c; j >= 0; j--)
	    {
	        a = this.objArray[i][j];
	    	if (a)
	    	{
	    	    for (k=0; k < a.length; k++)
	    	    {
				    if (!a[k].isFloorObject) { this.objContainer.addChild(a[k]); }
				}
		    }
		}
	}
};

/**
 * Clears the highlight for the old path and highlights the new path on map.
 *
 * @method arrangePathHighlight
 * @private
 * @param [currentPath] {Array(Object)} the old path to clear the highlight from
 * @param newPath {Array(Object)} the new path to highlight
 */
TRAVISO.EngineView.prototype.arrangePathHighlight = function(currentPath, newPath) 
{
    var i, tile, pathItem;
    if (currentPath)
    {
        for (i=0; i < currentPath.length; i++)
        {
            pathItem = currentPath[i];
            if (!newPath || newPath.indexOf(pathItem) === -1)
            {
                tile = this.tileArray[pathItem.mapPos.r][pathItem.mapPos.c];
                tile.setHighlighted(false);
            }
        }
    }
    if (newPath)
    {
    	for (i=0; i < newPath.length; i++)
        {
            pathItem = newPath[i];
            if (!currentPath || currentPath.indexOf(pathItem) === -1)
            {
                tile = this.tileArray[pathItem.mapPos.r][pathItem.mapPos.c];
                tile.setHighlighted(true);
            }
        }
    }   
};

/**
 * Stops a moving object.
 *
 * @method stopObject
 * @private
 * @param obj {ObjectView} map-object to be moved on path
 */
TRAVISO.EngineView.prototype.f = function(obj) 
{
    obj.currentPath = null;
    obj.currentTarget = null;
    obj.currentTargetTile = null;
    this.moveEngine.removeMovable(obj);
};

/**
 * Moves the specified map-object through a path.
 *
 * @method moveObjThrough
 * @private
 * @param obj {ObjectView} map-object to be moved on path
 * @param obj.mapPos {Object} object including r and c coordinates of the map-object
 * @param obj.mapPos.c {Number} the column index of the map location
 * @param obj.mapPos.r {Number} the row index of the map location
 * @param path {Array(Object)} path to move object on
 * @param [speed=null] {Number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null 
 */
TRAVISO.EngineView.prototype.moveObjThrough = function(obj, path, speed) 
{
    if (this.config.instantObjectRelocation)
	{
		var tile = this.tileArray[path[0].mapPos.r][path[0].mapPos.c];
		obj.position.x = tile.position.x;
		obj.position.y = tile.position.y + this.TILE_HALF_H;
		this.arrangeObjTransperancies(obj, obj.mapPos, tile.mapPos);
		this.arrangeObjLocation(obj, tile.mapPos);
		this.arrangeDepthsFromLocation(tile.mapPos);
	}
	else
	{
        if (this.config.highlightPath && this.currentControllable === obj)
        {
            this.arrangePathHighlight(obj.currentPath, path);
		}
        
        if (obj.currentTarget)
		{
			// TRAVISO.trace("Object has a target, update the path with the new one");
            // this.moveEngine.addNewPathToObject(obj, path, speed);
            this.stopObject(obj);
		}

		this.moveEngine.prepareForMove(obj, path, speed);
		
		obj.currentTargetTile = obj.currentPath[obj.currentPathStep];
		
		this.onObjMoveStepBegin(obj, obj.currentPath[obj.currentPathStep].mapPos);
	}
};

/**
 * Sets up the engine at the begining of each tile change move for the specified object
 *
 * @method onObjMoveStepBegin
 * @private
 * @param obj {ObjectView} map-object that is being moved
 * @param obj.mapPos {Object} object including r and c coordinates of the map-object
 * @param obj.mapPos.c {Number} the column index of the map location
 * @param obj.mapPos.r {Number} the row index of the map location
 * @param [obj.currentDirection="idle"] {Number} current direction id of the map-object
 * @param pos {Object} object including r and c coordinates for the target location
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 * @return {Boolean} if the target tile was available and map-object has moved
 */
TRAVISO.EngineView.prototype.onObjMoveStepBegin = function(obj, pos) 
{
	// TRAVISO.trace("onObjMoveStepBegin");
	// Note that mapPos is being updated prior to movement
	
	obj.currentDirection = TRAVISO.getDirBetween(obj.mapPos.r, obj.mapPos.c, pos.r, pos.c);
    
    obj.changeVisualToDirection(obj.currentDirection, true);
    
	// check if the next target pos is still empty
	if (!this.pathFinding.isCellFilled(pos.c,pos.r))
	{
		// pos is movable
	    // this.arrangeObjTransperancies(obj, obj.mapPos, pos);
	    // this.arrangeObjLocation(obj, pos);
    	// this.arrangeDepthsFromLocation(obj.mapPos);
    	
    	// if there is other object(s) on the target tile, notify the game
    	// var objects = this.getObjectsAtLocation(pos);
    	// if (objects && objects.length > 1)
    	// {
    		// if (this.config.otherObjectsOnTheNextTileCallback) { this.config.otherObjectsOnTheNextTileCallback( obj, objects ); }
    	// }
    	
    	this.moveEngine.setMoveParameters(obj, pos);
    	
    	this.moveEngine.addMovable(obj);
    	
    	return true;
    }
    else
    {
    	// pos is NOT movable
        this.moveEngine.removeMovable(obj);
    	this.checkAndMoveObjectToLocation(obj, obj.currentPath[0].mapPos);
    	
        return false;
    }
};

/**
 * Sets up the engine at the end of each tile change move for the specified object
 *
 * @method onObjMoveStepEnd
 * @private
 * @param obj {ObjectView} map-object that is being moved
 * @param obj.mapPos {Object} object including r and c coordinates of the map-object
 * @param obj.mapPos.c {Number} the column index of the map location
 * @param obj.mapPos.r {Number} the row index of the map location
 * @param obj.currentPath {Array(Object)} current path assigned to the map-object
 * @param obj.currentPathStep {Number} current step on the path
 * @param [obj.currentDirection="idle"] {String} current direction id of the map-object
 */
TRAVISO.EngineView.prototype.onObjMoveStepEnd = function(obj) 
{
	//TRAVISO.trace("onObjMoveStepEnd");
	
	obj.currentPathStep--;
    obj.currentTarget = null;
    obj.currentTargetTile = null;
    var pathEnded = (0 > obj.currentPathStep);
    this.moveEngine.removeMovable(obj);
    
    if (!pathEnded)
    {
        if (this.config.checkPathOnEachTile) { this.checkAndMoveObjectToLocation(obj, obj.currentPath[0].mapPos); }
        else
        {
            obj.currentPath.splice(obj.currentPath.length-1, 1);
            this.moveObjThrough(obj, obj.currentPath);
        }
    }
    else
    {
        // reached to the end of the path
        obj.changeVisualToDirection(obj.currentDirection, false);
    }
    
    if (this.currentControllable === obj)
	{
    	var tile = this.tileArray[obj.mapPos.r][obj.mapPos.c];
    	tile.setHighlighted(false, !this.config.tileHighlightAnimated);
    	
   	    // if (this.config.followCharacter) { this.centralizeToLocation(obj.mapPos.c, obj.mapPos.r); }
    }
	
	if (pathEnded && this.config.objectReachedDestinationCallback) { this.config.objectReachedDestinationCallback( obj ); }
};

TRAVISO.EngineView.prototype.checkForFollowCharacter = function(obj) 
{
    if (this.config.followCharacter && this.currentControllable === obj)
	{
        this.currentFocusLocation = { c: obj.mapPos.c, r: obj.mapPos.r };
    	var px = this.externalCenter.x - obj.position.x * this.currentScale;
    	var py = this.externalCenter.y - obj.position.y * this.currentScale;
        // this.centralizeToPoint(px, py, true);
        this.moveEngine.addTween(this.mapContainer.position, 0.1, { x: px, y: py }, 0, "easeOut_ex", true );
    }
};

TRAVISO.EngineView.prototype.checkForTileChange = function(obj) 
{
    if (this.config.objectUpdateCallback) { this.config.objectUpdateCallback( obj ); }
    
	var pos = { x: obj.position.x, y: obj.position.y - this.TILE_HALF_H };
	// var tile = this.tileArray[obj.mapPos.r][obj.mapPos.c];
	var tile = this.tileArray[obj.currentTargetTile.mapPos.r][obj.currentTargetTile.mapPos.c];
	// move positions to parent scale
	var vertices = [];
	for (var i=0; i < tile.vertices.length; i++)
	{
		vertices[i] = [tile.vertices[i][0] + tile.position.x, tile.vertices[i][1] + tile.position.y];
	}
	
	if (obj.currentTargetTile.mapPos.r !== obj.mapPos.r || obj.currentTargetTile.mapPos.c !== obj.mapPos.c)
	{
		if (TRAVISO.isInPolygon(pos, vertices))
		{
			this.arrangeObjTransperancies(obj, obj.mapPos, obj.currentTargetTile.mapPos);
		    this.arrangeObjLocation(obj, obj.currentTargetTile.mapPos);
	    	this.arrangeDepthsFromLocation(obj.mapPos);
	    	
	    	// if there is other object(s) on the target tile, notify the game
	    	var objects = this.getObjectsAtLocation(obj.currentTargetTile.mapPos);
	    	if (objects && objects.length > 1)
	    	{
	    		if (this.config.otherObjectsOnTheNextTileCallback) { this.config.otherObjectsOnTheNextTileCallback( obj, objects ); }
	    	}
		}
	}	
};

/**
 * Searches and returns a path between two locations if there is one.
 *
 * @method getPath
 * @param from {Object} object including r and c coordinates of the source location
 * @param from.c {Number} the column index of the map location
 * @param from.r {Number} the row index of the map location
 * @param to {Object} object including r and c coordinates of the target location
 * @param to.c {Number} the column index of the map location
 * @param to.r {Number} the row index of the map location
 * @return {Array(Object)} an array of path items defining the path
 */
TRAVISO.EngineView.prototype.getPath = function(from, to) 
{
	if (this.pathFinding) { return this.pathFinding.solve(from.c, from.r, to.c, to.r); }
	else { throw new Error("Path finding hasn't been initialized yet!"); }
};

/**
 * Checks for a path and moves the map-object on map if there is an available path
 *
 * @method checkAndMoveObjectToTile
 * @param obj {ObjectView} map-object that is being moved
 * @param obj.mapPos {Object} object including r and c coordinates of the map-object
 * @param obj.mapPos.c {Number} the column index of the map location
 * @param obj.mapPos.r {Number} the row index of the map location
 * @param tile {TileView} target map-tile or any custom object that has 'mapPos' and 'isMovableTo' defined
 * @param tile.isMovableTo {Boolean} if the target tile is movable onto
 * @param tile.mapPos {Object} object including r and c coordinates of the map-tile
 * @param tile.mapPos.c {Number} the column index of the map location
 * @param tile.mapPos.r {Number} the row index of the map location
 * @param [speed=null] {Number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null 
 * @return {Boolean} if there is an available path to move to the target tile
 */
TRAVISO.EngineView.prototype.checkAndMoveObjectToTile = function(obj, tile, speed) 
{
	if (tile.isMovableTo)
	{
		return this.checkAndMoveObjectToLocation(obj, tile.mapPos, speed);
	}
	return false;
};

/**
 * Checks for a path and moves the map-object on map if there is an available path
 *
 * @method checkAndMoveObjectToLocation
 * @param obj {ObjectView} map-object that is being moved
 * @param obj.mapPos {Object} object including r and c coordinates of the map-object
 * @param obj.mapPos.c {Number} the column index of the map location
 * @param obj.mapPos.r {Number} the row index of the map location
 * @param pos {Object} object including r and c coordinates for the target location
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 * @param [speed=null] {Number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null 
 * @return {Boolean} if there is an available path to move to the target tile
 */
TRAVISO.EngineView.prototype.checkAndMoveObjectToLocation = function(obj, pos, speed) 
{
	var path = this.getPath(obj.mapPos, pos);
	if (path)
	{
		// begin moving process
		this.moveObjThrough(obj, path, speed);
		
		return path.length;
	}
	return false;
};

/**
 * Moves the current controllable map-object to a location if available. 
 *
 * @method moveCurrentControllableToLocation
 * @param pos {Object} object including r and c coordinates for the target location
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 * @param [speed=null] {Number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null 
 * @return {Boolean} if there is an available path to move to the target tile
 */
TRAVISO.EngineView.prototype.moveCurrentControllableToLocation = function(pos, speed) 
{
	if (!this.currentControllable)
    {
        throw new Error("TRAVISO: currentControllable is not defined!");
    }
    return this.checkAndMoveObjectToLocation(this.currentControllable, pos, speed);
};

/**
 * Moves the current controllable map-object to one of the adjacent available tiles of the map-object specified. 
 *
 * @method moveCurrentControllableToObj
 * @param obj {ObjectView} target map-object
 * @param obj.mapPos {Object} object including r and c coordinates
 * @param obj.mapPos.c {Number} the column index of the map location
 * @param obj.mapPos.r {Number} the row index of the map location
 * @param obj.columnSpan {Number} number of tiles that map-object covers horizontally on the isometric map
 * @param obj.rowSpan {Number} number of tiles that map-object covers vertically on the isometric map
 * @param [speed=null] {Number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null 
 * @return {Boolean} if there is an available path to move to the target map-object
 */
TRAVISO.EngineView.prototype.moveCurrentControllableToObj = function(obj, speed)
{
    if (!this.currentControllable)
    {
        throw new Error("TRAVISO: currentControllable is not defined!");
    }
    // check if there is a preferred interaction point
    if (obj.currentInteractionOffset)
    {
        var targetPos = { c: obj.mapPos.c + obj.currentInteractionOffset.c, r: obj.mapPos.r + obj.currentInteractionOffset.r };
        if (this.checkAndMoveObjectToLocation(this.currentControllable, targetPos, speed))
        {
            return true;
        }
    } 
	var cellArray = this.pathFinding.getAdjacentOpenCells(obj.mapPos.c, obj.mapPos.r, obj.columnSpan, obj.rowSpan);
	var tile;
	var minLength = 3000;
	var path, minPath, tempFlagHolder;
	for (var i=0; i < cellArray.length; i++)
	{
		tile = this.tileArray[cellArray[i].mapPos.r][cellArray[i].mapPos.c];
		if (tile)
		{
			if(tile.mapPos.c === this.currentControllable.mapPos.c && tile.mapPos.r === this.currentControllable.mapPos.r)
			{
				// already next to the object, do nothing
                this.arrangePathHighlight(this.currentControllable.currentPath);
                this.stopObject(this.currentControllable);
                tempFlagHolder = this.config.instantObjectRelocation;
                this.config.instantObjectRelocation = true;
                this.moveObjThrough(this.currentControllable, [tile]);
                this.config.instantObjectRelocation = tempFlagHolder;
                this.currentControllable.changeVisualToDirection(this.currentControllable.currentDirection, false);
				if (this.config.objectReachedDestinationCallback) { this.config.objectReachedDestinationCallback( this.currentControllable ); }
				return true;
			}
			path = this.getPath(this.currentControllable.mapPos, tile.mapPos);
			if (path && path.length < minLength)
			{
				minLength = path.length;
				minPath = path;
			}
		}
	}
	
	if (minPath) 
	{
		this.moveObjThrough(this.currentControllable, minPath, speed);
		return true;
	}
	else
	{
		return false;
	}
};

/**
 * Finds the nearest tile to the point given in the map's local scope. 
 *
 * @method getTileFromLocalPos
 * @param lp {Object} point to check
 * @param lp.x {Number} x component
 * @param lp.y {Number} y component
 * @return {TileView} the nearest map-tile if there is one
 */
TRAVISO.EngineView.prototype.getTileFromLocalPos = function(lp) 
{
	var closestTile = null;
	if(TRAVISO.isInPolygon(lp, this.mapVertices))
	{
		// Using nearest point instead of checking polygon vertices for each tile. Should be faster...
		// NOTE: there is an ignored bug (for better performance) that tile is not selected when u click on the far corner
		var thresh = this.TILE_HALF_W / 2;
		var tile, i, j, dist;
		var closestDist = 3000;
		for (i = 0; i < this.mapSizeR; i++)
		{
		    for (j = 0; j < this.mapSizeC; j++)
		    {
		    	tile = this.tileArray[i][j];
		    	if (tile)
		    	{
		    	    dist = TRAVISO.getDist(lp, tile.position);
			    	if (dist < closestDist)
			    	{
			    		closestDist = dist;
			    		closestTile = tile;
			    		if (dist < thresh) { break; }
			    	}
			    }
		    }
		}
	}
	return closestTile;
};

/**
 * Checks if an interaction occurs using the interaction data coming from PIXI.
 * If there is any interaction starts necessary movements or performs necessary callbacks.
 *
 * @method checkForTileClick
 * @private
 * @param mdata {Object} interaction data coming from PIXI
 * @param mdata.global {Object} global interaction point
 */
TRAVISO.EngineView.prototype.checkForTileClick = function(mdata) 
{
	var lp = this.mapContainer.toLocal(mdata.global);
	var closestTile = this.getTileFromLocalPos(lp);
	if (closestTile)
	{
		var a = this.objArray[closestTile.mapPos.r][closestTile.mapPos.c];
		if (a)
        {
            for (var k=0; k < a.length; k++)
            {
                if(a[k].isInteractive) 
                {
                    if (this.config.objectSelectCallback) { this.config.objectSelectCallback( a[k] ); }
                    break;
                }
                // TODO CHECK: this might cause issues when there is one movable and one not movable object on the same tile
                else if(a[k].isMovableTo)
                {
                    if (this.config.dontAutoMoveToTile || !this.currentControllable || this.checkAndMoveObjectToTile(this.currentControllable, closestTile))
                    {
                        if (this.config.highlightTargetTile) { closestTile.setHighlighted(true, !this.config.tileHighlightAnimated); }
                        if (this.config.tileSelectCallback) { this.config.tileSelectCallback(closestTile.mapPos.r, closestTile.mapPos.c); }
                        break;
                    }
                } 
            }
        }
		else if (this.config.dontAutoMoveToTile || !this.currentControllable || this.checkAndMoveObjectToTile(this.currentControllable, closestTile))
		{
			if (this.config.highlightTargetTile) { closestTile.setHighlighted(true, !this.config.tileHighlightAnimated); }
			if (this.config.tileSelectCallback) { this.config.tileSelectCallback(closestTile.mapPos.r, closestTile.mapPos.c); }
		} 
	}
};

/**
 * Enables mouse/touch interactions.
 *
 * @method enableInteraction
 */
TRAVISO.EngineView.prototype.enableInteraction = function()
{
	this.mousedown = this.touchstart = this.onMouseDown.bind(this);
	this.mousemove = this.touchmove = this.onMouseMove.bind(this);
	this.mouseup = this.mouseupout = this.touchend = this.onMouseUp.bind(this);
	this.interactive = true;
};
/**
 * Disables mouse/touch interactions.
 *
 * @method disableInteraction
 */
TRAVISO.EngineView.prototype.disableInteraction = function()
{
	this.mousedown = this.touchstart = null;
	this.mousemove = this.touchmove = null;
	this.mouseup = this.mouseupout = this.touchend = null;
	this.interactive = true;
	this.dragging = false;
};

/**
 * Checks if the given point is inside the masked area if there is a mask defined.
 *
 * @method isInteractionInMask
 * @private
 * @param p {Object} point to check
 * @param p.x {Number} x component
 * @param p.y {Number} y component
 * @return {Boolean} if the point is inside the masked area
 */
TRAVISO.EngineView.prototype.isInteractionInMask = function(p)
{
    if (this.config.useMask)
    {
        if (p.x < this.posFrame.x ||
            p.y < this.posFrame.y ||
            p.x > this.posFrame.x + this.posFrame.w ||
            p.y > this.posFrame.y + this.posFrame.h)
        {
            return false;  
        }
    }
    return true;
};

// ******************** START: MOUSE INTERACTIONS **************************** //
TRAVISO.EngineView.prototype.onMouseDown = function(event) 
{
    var globalPos = event.data.global;
	if (!this.dragging && this.isInteractionInMask(globalPos))
	{
	    this.dragging = true;
		//this.mouseDownTime = new Date();
		this.dragInitStartingX = this.dragPrevStartingX = globalPos.x;
		this.dragInitStartingY = this.dragPrevStartingY = globalPos.y;
	}
};
TRAVISO.EngineView.prototype.onMouseMove = function(event) 
{
	if (this.dragging && this.config.mapDraggable)
	{
        var globalPos = event.data.global;
		this.mapContainer.position.x += globalPos.x - this.dragPrevStartingX;
		this.mapContainer.position.y += globalPos.y - this.dragPrevStartingY;
		this.dragPrevStartingX = globalPos.x;
		this.dragPrevStartingY = globalPos.y;
	}
};
TRAVISO.EngineView.prototype.onMouseUp = function(event) 
{
	if (this.dragging)
	{
		this.dragging = false;
		//var passedTime = (new Date()) - this.mouseDownTime;
		var distX = event.data.global.x - this.dragInitStartingX;
		var distY = event.data.global.y - this.dragInitStartingY;
		
		if (Math.abs(distX) < 5 && Math.abs(distY) < 5)
		{
			// NOT DRAGGING IT IS A CLICK
			this.checkForTileClick(event.data);
		}
	}
};
// ********************* END: MOUSE INTERACTIONS **************************** //


/**
 * Repositions the content according to user settings. Call this method 
 * whenever you want to change the size or position of the engine.
 *
 * @method repositionContent
 * @param [posFrame] {Object} frame to position the engine, default is { x : 0, y : 0, w : 800, h : 600 }
 */
TRAVISO.EngineView.prototype.repositionContent = function(posFrame)
{
    TRAVISO.trace("EngineView repositionContent");
    
    posFrame = posFrame || this.posFrame || { x : 0, y : 0, w : 800, h : 600 };
    
    this.position.x = posFrame.x;
    this.position.y = posFrame.y;

    this.externalCenter =
    {
        x : posFrame.w >> 1,
        y : posFrame.h >> 1
    };
    this.centralizeToCurrentFocusLocation(true);

    if (this.bg)
    {
        this.bg.clear();
        // this.bg.lineStyle(2, 0x000000, 1);
        this.bg.beginFill(this.config.backgroundColor, 1.0);
        this.bg.drawRect(0, 0, posFrame.w, posFrame.h);
        this.bg.endFill();
    }
    
    if (this.mapMask && this.mapContainer)
    {
        this.mapMask.clear();
        this.mapMask.beginFill("#000000");
        this.mapMask.drawRect(0, 0, posFrame.w, posFrame.h);
        this.mapMask.endFill();

        this.mapContainer.mask = this.mapMask;
    }
    
    this.posFrame = posFrame;
};

/**
 * Clears all references and stops all animations inside the engine.
 * Call this method when you want to get rid of an engine instance.
 *
 * @method destroy
 */
TRAVISO.EngineView.prototype.destroy = function() 
{
	TRAVISO.trace("EngineView destroy");
	
	this.disableInteraction();
	
	this.moveEngine.destroy();
    this.moveEngine = null;
	
	var item, i, j, k;
    for (i = 0; i < this.mapSizeR; i++)
    {
        for (j = this.mapSizeC-1; j >= 0; j--)
        {
            item = this.tileArray[i][j];
            if (item)
            {
                item.destroy();
                // this.groundContainer.removeChild(item);
            }
            this.tileArray[i][j] = null;
            
            item = this.objArray[i][j];
            if (item)
            {
                for (k=0; k < item.length; k++)
                {
                    if (item[k])
                    {
                        item[k].destroy();
                        // this.objContainer.removeChild(item[k]);
                    }
                    item[k] = null;
                }
            }
            this.objArray[i][j] = null;
        }
    }
    item = null;
	
	
	this.pathFinding.destroy();
	this.pathFinding = null;
	
	this.currentControllable = null;
	this.tileArray = null;
	this.objArray = null;
	this.bg = null;
	this.groundContainer = null;
	this.objContainer = null;
	
	if (this.mapContainer)
	{
	    this.mapContainer.mask = null;
	    this.removeChild(this.mapContainer);
	    this.mapContainer = null;
	}
	if (this.mapMask)
	{
		this.removeChild(this.mapMask);
	    this.mapMask = null;
	}
	
	this.config = null;
    this.mapData.groundMapData = null;
    this.mapData.objectsMapData = null;
    this.mapData.objects = null;
    this.mapData.tiles = null;
    this.mapData = null;
};
