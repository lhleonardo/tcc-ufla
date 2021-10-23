#!/bin/bash  
max=200
for i in `seq 2 $max`
do
    node segunda-execucao.js
    sleep 1
    kill $(ps -aux | grep tcc | awk '{print $2}')
    sleep 1
done