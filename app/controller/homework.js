'use strict';

const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');
// const awaitWriteStream = require('await-stream-ready').write;
const Controller = require('egg').Controller;
// const sendToWormhole = require('stream-wormhole');

moment.locale('zh-cn');
const rootPath = './data';

const homeworks = {
  1: {
    title: '第一次实验',
    subtitle: '线性回归和随机梯度下降',
    storagePath: `${rootPath}/experiment1/`,
    tutorial: 'https://www.zybuluo.com/mymy/note/1621311',
  },
  2: {
    title: '第二次实验',
    subtitle: '逻辑回归和支持向量机',
    storagePath: `${rootPath}/experiment2/`,
    tutorial: 'https://www.zybuluo.com/mymy/note/1621325',
  },
  3: {
    title: '第三次实验',
    subtitle: '基于AdaBoost算法的人脸检测',
    storagePath: `${rootPath}/experiment3/`,
    tutorial: 'https://www.zybuluo.com/mymy/note/1621330',
  },
  4: {
    title: '第四次实验',
    subtitle: '基于神经网络的人脸检测',
    storagePath: `${rootPath}/experiment4`,
    tutorial: 'https://www.zybuluo.com/mymy/note/1621354',
  },
  5: {
    title: '第五次实验',
    subtitle: '推荐系统实践',
    storagePath: `${rootPath}/experiment5`,
    tutorial: 'https://www.zybuluo.com/mymy/note/1621347',
  },
  6: {
    title: '第六次实验（额外实验）',
    subtitle: 'XGBoost实验手册',
    storagePath: `${rootPath}/experiment6`,
    tutorial: 'https://www.zybuluo.com/mymy/note/1621336',
  },
  7: {
    title: '新增实验（兴趣拓展）',
    subtitle: '基于序列模型的中英文翻译机',
    storagePath: `${rootPath}/experiment7`,
    tutorial: 'https://www.zybuluo.com/mymy/note/1630799',
  },
  8: {
    title: '新增实验（兴趣拓展）',
    subtitle: '基于神经网络的语音合成',
    storagePath: `${rootPath}/experiment8`,
    tutorial: 'https://www.zybuluo.com/mymy/note/1747200',
  },
};

class HomeworkController extends Controller {
  async index() {
    await this.ctx.render('homework/index.njk', { experiments: homeworks });
  }

  async show() {
    const homeworkId = this.ctx.params.id;
    const homework = homeworks[homeworkId];
    if (typeof homework === 'undefined') {
      this.ctx.status = 404;
      return;
    }
    homework.id = homeworkId;

    const reportPath = path.join(homework.storagePath, 'reports');
    const codePath = path.join(homework.storagePath, 'codes');

    const files = await Promise.all([
      this.listFiles(reportPath),
      this.listFiles(codePath),
    ]);

    homework.reports = files[0];
    homework.codeFiles = files[1];
    // homework.reports = await this.listFiles(reportPath);
    // homework.codeFiles = await this.listFiles(codePath);

    // homework.files = files;
    // console.log(files);
    await this.ctx.render('homework/detail.njk', homework);
  }

  async listFiles(storagePath) {
    try {
      await fs.ensureDir(storagePath);
    } catch (_) {
      await fs.mkdirp(storagePath);
    }

    const dir = await fs.readdir(storagePath);
    const files = await Promise.all(
      // 遍历所有文件，获取文件信息
      dir.map(
        filename => fs.stat(
          path.join(storagePath, filename)
        ).then(
          stat => ({
            filename, // 去掉后缀
            updatedAt: moment(stat.mtime).format('YYYY MMM Do, h:mm:ss a'),
            stat,
          })
        )
      )
    );

    files.sort((a, b) => {
      return b.stat.mtime.getTime() - a.stat.mtime.getTime();
    });

    return files;
  }

  // async create() {
  //   // const file = await this.ctx.getFileStream();
  //   const homeworkId = this.ctx.query.id;
  //   const homework = homeworks[homeworkId];
  //   homework.id = homeworkId;
  //   const name = file.fields.student_name + '.zip';
  //   const filename = path.join(homework.storagePath, name);
  //   const tempfilename = filename + '.tmp';
  //   console.log(file);


  //   const wstream = fs.createWriteStream(tempfilename);
  //   try {
  //     await awaitWriteStream(file.pipe(wstream));
  //   } catch (err) {
  //     sendToWormhole(file);
  //     throw err;
  //   }
  //   const stat = await fs.stat(tempfilename);
  //   const fileSizeInBytes = stat.size;
  //   // Convert the file size to megabytes (optional)
  //   const fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
  //   // console.log(fileSizeInMegabytes);
  //   if (fileSizeInMegabytes > 1) {
  //     await fs.remove(tempfilename);
  //     this.ctx.body = 'Too large!';
  //   } else {
  //     await fs.remove(filename);
  //     await fs.move(tempfilename, filename);
  //     this.ctx.redirect('/homeworks/' + homeworkId);
  //   }


  //   // console.log(homeworkId);
  //   // console.log(file);
  // }
  async create() {
    const homeworkId = this.ctx.query.id;
    const homework = homeworks[homeworkId];
    const { files, body } = this.ctx.req;


    const report = files.report[0];
    const codeFile = files.homework[0];

    // if (codeFile.size > 1024 * 1024) {
    //   this.ctx.body = 'File too large';
    //   return;
    // }  

    const reportPath = path.join(homework.storagePath, 'reports');
    const codePath = path.join(homework.storagePath, 'codes');

    const filename = body.student_number + '_' + body.student_name;

    const reportFilename = path.join(reportPath, filename + '.pdf');
    const codeFilename = path.join(codePath, filename + '.zip');

    await Promise.all([
      fs.remove(reportFilename),
      fs.remove(codeFilename),
    ]);

    await Promise.all([
      fs.move(report.path, reportFilename),
      fs.move(codeFile.path, codeFilename),
    ]);

    this.ctx.body = `<h1>Upload succeed!</h1><a href="${'/homeworks/' + homeworkId}">BACK</a>`;
  }
}

module.exports = HomeworkController;
