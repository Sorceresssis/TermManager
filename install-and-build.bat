@echo off

echo ---------------------------------------
echo              开始安装依赖
echo ---------------------------------------
call npm run install-deps
echo ---------------------------------------
echo              依赖安装完成
echo ---------------------------------------

echo ---------------------------------------
echo                开始构建
echo ---------------------------------------
call npm run build
echo ---------------------------------------
echo                构建完成
echo ---------------------------------------

pause