//包装函数
module.exports = function(grunt){

	//任务配置，所有插件的配置信息
	grunt.initConfig({

		//获取package.json的信息
		pkg:grunt.file.readJSON('package.json'),

		//uglify插件的配置信息
		uglify:{
//			options:{
//				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
//			},
			builda: {//任务一：压缩a.js，不混淆变量名，保留注释，添加banner和footer
                options: {
                    mangle: false, //不混淆变量名
                    preserveComments: 'all', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                    footer:'\n/*! <%= pkg.name %> 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */'//添加footer
                },
                files: {
                    'doc/js/a.min.js': ['assets/js/test-1.js']
                }
            },
            buildb:{//任务二：压缩b.js，输出压缩信息
                options: {
                    report: "min"//输出压缩率，可选的值有 false(不输出信息)，gzip
                },
                files: {
                    'doc/js/b.min.js': ['assets/js/test-2.js']
                }
            },
            buildall: {//任务三：按原文件结构压缩assets/js文件夹内所有JS文件
                files: [{
                    expand:true,
                    cwd:'assets/js',//assets/js目录下
                    src:'**/*.js',//所有js文件
                    dest: 'doc/js'//输出到此目录下
                }]
            },
            release: {//任务四：合并压缩a.js和b.js
                files: {
                    'doc/js/all.min.js': ['assets/js/test-1.js', 'assets/js/test-2.js']
                }
            }
			// build:{
			// 	src:'src/test-1.js',
			// 	dest:'doc/js/<%=pkg.version%>.min.js'
			// }
		}
	})

	grunt.loadNpmTasks('grunt-contrib-uglify');
	//告诉grunt，当我们在终端中输入grunt时需要做些什么（注意先后顺序）
	//grunt.registerTask('default',['uglify']);
	// 默认任务
    grunt.registerTask('default', ['uglify:release']);
    grunt.registerTask('mina', ['uglify:builda']);
    grunt.registerTask('minb', ['uglify:buildb']);
    grunt.registerTask('minall', ['uglify:buildall']);

}
