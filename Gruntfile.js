//包装函数
module.exports = function(grunt){

	//任务配置，所有插件的配置信息
	grunt.initConfig({

		//获取package.json的信息
		pkg:grunt.file.readJSON('package.json'),

		//uglify插件的配置信息
		uglify:{
//			options:{
//				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'  //标记，编译之后文件顶部标记
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
		},
	
		//less插件的配置信息
		less:{
			buttons: {
		        options: {
		          strictMath: true
//		          sourceMap: true,
//		          outputSourceFiles: true,
//		          sourceMapURL: '<%= pkg.name %>.css.map',
//		          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
		        },
		        src: 'assets/less/buttons.less',
		        dest: 'doc/css/<%= pkg.name %>-buttons.css'
		   },
			buildall: {
		        options: {
		          strictMath: true,
		          compress:true
		        },
		        files: [{
                    expand:true,
                    cwd:'assets/less',//assets/less目录下
                    src:'**/*.less',//所有js文件
                    dest: 'doc/css',//输出到此目录下                    
                    ext: '.css'
                }]
		   	},
            release: {//合并压缩
		        options: {
		          strictMath: true, //如果设置为true，表达式需要用括号括起来
		          compress:true //压缩编译之后的css文件，即删除css文件中的空行和空格
		        },
                files: {
                    'doc/css/all.css': ['assets/less/base.less','assets/less/buttons.less']
                }
            }
		}
		
	})

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	
	//告诉grunt，当我们在终端中输入grunt时需要做些什么（注意先后顺序）
	//grunt.registerTask('default',['uglify']);
	// 默认任务
    grunt.registerTask('default', ['uglify:release']);
    grunt.registerTask('mina', ['uglify:builda']);
    grunt.registerTask('minb', ['uglify:buildb']);
    grunt.registerTask('minall', ['uglify:buildall']);

    grunt.registerTask('css', ['less:release']);
    grunt.registerTask('allcss', ['less:buildall']);
}
