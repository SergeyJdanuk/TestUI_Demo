#!/system/bin/sh
export PATH=$(PATH):/system/bin:/system/xbin
echo "Content-type: text/plain"
echo ""

cgi_bin_dir="/data/local/testui/cgi-bin"
cache_dir="$cgi_bin_dir/../cache"

# $QUERY_STRING="api=/public/film/list/100?limit=40&hash=e9c59ba218208d7b11bd3963d7c5adfa"

api=`echo "$QUERY_STRING" | cut -d'&' -f1 | sed "s/api=//g"`
hash=`echo "$QUERY_STRING" | sed "s/.*hash=\(.*\)$/\1/"`


#echo "api: $api" # Должно быть "/public/film/list/100?limit=40"
#echo "hash_url: $hash_url" # Должно быть "e9c59ba218208d7b11bd3963d7c5adfa"
   
print_genres() {
    cat "$cache_dir/genres.json"
}
   
print_genres_movies() {
   cat "$cache_dir/genres-movies/${hash}.json"
}
print_movie() {
    cat "$cache_dir/movies-metadata/${hash}.json"
}
print_nothing() {
    echo "Nothing"
}
#if [ ! -z `echo $api_url | grep '/public/film/list'` ];
#then
#    print_genres_movies
#    exit
#fi
if [ ! -z `echo $api | grep '/public/genres'` ];
then
    print_genres
    exit
fi
if [ ! -z `echo $api | grep '/public/film/list'` ];
then
    print_genres_movies
    exit
fi
if [ ! -z `echo $api | grep '/public/film/'` ];
then
    print_movie
    exit
fi
