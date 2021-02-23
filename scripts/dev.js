// 只针对具体的某个包打包

const fs = require('fs');
const execa = require('execa'); // 开启一个子进程 进行打包  最终还是使用rollup进行打包

// 同步读取当前目录下的某个文件 并过滤掉所有
// const targets = fs.readdirSync('packages').filter(f => {
//     if(!fs.statSync(`packages/${f}`).isDirectory()) { // 判断packages目录下的文件是不是文件夹
//         return false;
//     }
//     return true;
// });

// 对目标进行依次打包 并行打包
// console.log(targets);

async function build(target) {
    /**
     * 参数一：rollup 使用rollup进行打包 
     * 参数二: ['-c','--environment','`TARGET:${target}`'] 
     *  1、-c 采用某个配置文件进行打包   或者是 -cw 一直监控打包的文件的变化
     *  2、--environment 采用环境变量来进行打包 
     *  3、打包的目标
     * 参数三: 把node子进程打包的信息共享给父进程
     */
    await execa('rollup',['-cw','--environment',`TARGET:${target}`],{stdio: 'inherit'}); //  
}
// dev 打包的时候只针对具体的某个文件，进行打包
const target = 'reactivity';
build(target);

// function runParallel(targets,interatorFn) { // 打包目标， 迭代函数
//     const res = [];
//     for(const item of targets) {
//         const p = interatorFn(item);
//         res.push(p);
//     }
//     return Promise.all(res);
// }

// runParallel(targets,build); // parallel