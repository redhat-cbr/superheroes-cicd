#!/bin/sh


f2() {
  _FN=$1
  _L1=$(yq -r '.spec.tasks[].name' <$_FN)
  _L2=()
  echo "| $(basename $_FN) |  | |"
  for j in ${_L1[@]}; do
    #_L2+=("${j}<BR>")
    echo "| |  ${j} | |"
  done
  #echo "| $(basename $_FN) |  ${_L2[@]} | |"
}

echo -e "## PIPELINES\n"
echo -e "| Pipeline | Tasks | Output | \n|-|-|-|"; 
for i in ../tekton/pipel*.yaml; do 
  f2 $i
done  
