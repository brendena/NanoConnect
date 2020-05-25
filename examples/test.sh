counter=1
while [ $counter -le 10 ]
do
    echo $counter
    node ./clientExample.js &
    ((counter++))
done
