define (['preloadjs', 'jquery'], function(preload, $) {
	var loadQueue = new preload.LoadQueue(true);
	loadQueue.on('fileprogress', loadProgressUpdate);
        loadQueue.loadFile({name: 'People', id: 'people', src: 'assets/json/people.json'});
        loadQueue.loadFile({name: 'Countries', id: 'countries', src: 'assets/json/countries.topo.json'});

        //loadQueue.loadFile({name: 'Tiles', id: 'tiles', src: 'tiles/geoserver.mbtiles'});
// DOM Elems
	var $progress = $('#loading-text');

	function loadProgressUpdate(e) {
		$progress.text('Loading\n{filename}\n{progress}%'.assign({
			filename: e.item.name,
			progress: (e.progress * 100).toFixed(0)
		}));
	}

        return loadQueue;
});
