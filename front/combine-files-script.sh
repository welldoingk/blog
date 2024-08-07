#!/bin/bash

# 결과를 저장할 파일명
output_file="combined_nextjs_files.txt"

# 대상 디렉토리 (현재 디렉토리로 설정, 필요시 변경 가능)
target_directory="."

# 출력 파일 초기화
> "$output_file"

# NextJS 관련 파일 확장자
file_types=("js" "jsx" "ts" "tsx" "css" "json")

# 파일 찾기 명령 구성
find_command="find \"$target_directory\" \("

for i in "${!file_types[@]}"; do
    if [ $i -ne 0 ]; then
        find_command+=" -o"
    fi
    find_command+=" -name \"*.${file_types[$i]}\""
done

find_command+=" \) -type f"

# IDE 설정 디렉토리 제외
exclude_dirs=(".idea" ".vscode" "node_modules" ".next")

for dir in "${exclude_dirs[@]}"; do
    find_command+=" -not -path \"*/$dir/*\""
done

# 추가로 제외할 파일
exclude_files=("package-lock.json" "package-lock.json")

for file in "${exclude_files[@]}"; do
    find_command+=" -not -name \"$file\""
done

# 파일 처리
eval $find_command | while read -r file; do
    # 출력 파일 자체는 제외
    if [ "$file" != "./$output_file" ]; then
        echo "파일 경로: $file" >> "$output_file"
        echo "----------------------------------------" >> "$output_file"
        cat "$file" >> "$output_file"
        echo -e "\n\n" >> "$output_file"
    fi
done

echo "모든 NextJS 관련 파일 내용이 $output_file 에 저장되었습니다. (IDE 설정 및 node_modules 디렉토리 제외)"