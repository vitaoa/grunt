//包装函数
module.exports = function(grunt) {

    //任务配置，所有插件的配置信息
    grunt.initConfig({

        //获取package.json的信息
        pkg: grunt.file.readJSON('package.json'),
		
		// Metadata.
		meta: {
//			libPath: 'lib/',
			distPath: 'dist',
//			jsPath: 'js/',
//			sassPath: 'sass/',
			lessPath:'soft-assets/less',
			imgPath:'soft-assets/images',
			examplesPath: 'examples'
		},
		
        //uglify插件的配置信息
        uglify: {
            builda: { //压缩a.js，不混淆变量名，保留注释，添加banner和footer
                options: {
                    mangle: false, //不混淆变量名
                    preserveComments: 'all', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                    footer: '\n/*! <%= pkg.name %> 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */' //添加footer
                },
                files: {
                    'doc/js/a.min.js': ['assets/js/test-1.js']
                }
            },
            buildall: { //按原文件结构压缩assets/js文件夹内所有JS文件
                files: [{
                    expand: true, // 设置为true，表示要支持cwd等更多配置
                    cwd: 'assets/js', //assets/js目录下
                    src: '**/*.js', //所有js文件
                    dest: 'doc/js' //输出到此目录下
                }]
            },
            release: { //任务四：合并压缩a.js和b.js
                files: {
                    'doc/js/all.min.js': ['assets/js/test-1.js', 'assets/js/test-2.js']
                }
            }
        },

        //less插件的配置信息
        less: {
            buttons: {
                src: 'assets/less/buttons.less',
                dest: 'doc/css/<%= pkg.name %>-buttons.css'
            },
            buildall: {
                options: {
                    strictMath: true,
                    compress: false
                },
                files: [{
                    expand: true, // 设置为true，表示要支持cwd等更多配置
                    cwd: 'soft-assets/less', //soft-assets/less目录下
                    src: '**/*.less', //所有less文件
                    dest: 'softcenter/css', //输出到此目录下                    
                    ext: '.css'
                }]
            },
            release: { //合并压缩
                options: {
                    strictMath: true, //如果设置为true，表达式需要用括号括起来
                    compress: true //压缩编译之后的css文件，即删除css文件中的空行和空格
                },
                files: {
                    'doc/css/all.css': ['assets/less/base.less', 'assets/less/buttons.less']
                }
            }
        },

        //autoprefixer插件的配置信息
        autoprefixer: {
            build: {
                options: {
                    strictMath: true
                },
                src: 'doc/css/buttons.css',
                dest: 'doc/css/prefixer-buttons.css'
            },
            buildall: {
                expand: true, //// 设置为true，表示要支持cwd等更多配置
                cwd: 'doc/css',
                src: ['**/*.css'],
                dest: 'doc/css'
            }
        },

        //cssmin插件的配置信息
        cssmin: {
            build: {
                files: {
                    'softcenter/css/softcenter-v2.css': ['soft-assets/css/softcenter-v2.css']
                }
            }
        },
        //copy插件的配置信息
		copy: {
		  	main: {
		    	expand: true,
				cwd: '<%= meta.distPath %>',
				src: ['**/*'],
				dest: '<%= meta.examplesPath %>',
				filter: 'isFile'
		  	},
		},
        //clean插件的配置信息
		clean: {
			all: ['<%= meta.examplesPath %>/*']
		},
		imagemin: {
          	dist: {
	            options: {
	                optimizationLevel: 3 //定义 PNG 图片优化水平    （1）
	            },	
	            files: [{
	              expand: true,
	              cwd: '<%= meta.imgPath %>/softcenter',   // 优化 softcenter 目录下所有 png/jpg/jpeg 图片
	              src: ['**/*.{png,jpg,gif}'], 
	              dest: 'softcenter/images/softcenter'   // 优化后的图片保存位置，覆盖旧图片，并且不作提示
	            }]
          	}
        },
        //watch插件的配置信息
        watch: {
			options: {
				dateFormat: function(time) {
					grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
					grunt.log.writeln('Waiting for more changes...');
				},
				livereload: true
			},
            scripts: {
				files: [
					'<%= meta.lessPath %>/**/*.less'
				],
				tasks: 'lcss'
            }
        }

    })
	
	//计划执行Task所需要的时间  
  	require('time-grunt')(grunt);
  	
  	// 加载Task任务
  	require('load-grunt-tasks')(grunt, {
//		pattern: 'grunt-contrib-*', //Load all grunt-contrib tasks
//		pattern: ['grunt-contrib-*', 'grunt-shell'], //Load all grunt-contrib tasks and another non-contrib task
//		pattern: ['grunt-contrib-*', '!grunt-contrib-coffee'], //Load all grunt-contrib tasks excluding one
//		scope: ['devDependencies', 'dependencies'], //Only load from devDependencies and dependencies
		scope: 'devDependencies', //Only load from devDependencies
		requireResolution: true
	});  
  	//下面相当于它require('load-grunt-tasks')(grunt);  
//  grunt.loadNpmTasks('grunt-contrib-uglify');
//  grunt.loadNpmTasks('grunt-contrib-cssmin');
//  grunt.loadNpmTasks('grunt-contrib-less');
//  grunt.loadNpmTasks('grunt-autoprefixer');
//  grunt.loadNpmTasks('grunt-contrib-watch');


    //告诉grunt，当我们在终端中输入grunt时需要做些什么（注意先后顺序）
    grunt.registerTask('minall', ['uglify:buildall']);

    grunt.registerTask('lcss', ['less:buildall']);

    grunt.registerTask('prefixercss', ['autoprefixer:build']);
    grunt.registerTask('cssm', ['cssmin']);
    grunt.registerTask('imgm', ['imagemin']);
	grunt.registerTask('dist', ['clean:all','copy']);

    grunt.registerTask('server', ['dist','watch']);

	grunt.event.on('watch', function(action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});
}
