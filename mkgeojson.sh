#! sh
unzip ~/src/MAPS/cgstftp.gis.ttu.edu/World/NaturalEarth__Cultural_HighResolution/ne_10m_admin_0_countries_lakes.zip
ogr2ogr -f GeoJSON -where "SU_A3 <> 'ATA'" countries.json ne_10m_admin_0_countries_lakes.shp
topojson --id-property SU_A3 -p name=NAME -p name -o countries.topo.json countries.json
unzip ~/src/MAPS/cgstftp.gis.ttu.edu/World/NaturalEarth__Cultural_HighResolution/ne_10m_admin_1_states_provinces_lakes.zip
ogr2ogr -f GeoJSON -where "gu_a3 = 'ARG' OR gu_a3 = 'FLK'" states.json ne_10m_admin_1_states_provinces_lakes.shp
mv states.json states_arg.json
topojson --id-property adm1_cod_1 -p name -o states_arg.topo.json states_arg.json
unzip ../../MAPS/cgstftp.gis.ttu.edu/World/NaturalEarth__Cultural_HighResolution/ne_10m_populated_places.zip
ogr2ogr -f GeoJSON -where "ADM0_A3 = 'ARG' and SCALERANK <= 4" cities.json ne_10m_populated_places.shp
topojson -p name=NAME -p state=ADM1NAME -p name -p state -o cities_arg.topo.json cities.json
mv cities_arg.topo.json countries.topo.json states_arg.topo.json assets/json/
