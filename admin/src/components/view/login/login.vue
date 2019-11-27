<template>
  <div class="login_page">
    <div class="login-container" style="background-color: #141a48;margin: 0px;overflow: hidden;">
      <div id="canvascontainer" ref='can'></div>
    </div>
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer">
        <div class="manage_tip">
          <span class="title">初学堂管理系统</span>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm" class="loginForm">
          <el-form-item prop="mobile">
            <!--<span class="fa-tips"><i class="fa fa-user"></i></span>-->
            <el-input class="area" type="text" placeholder="用户名" v-model="loginForm.mobile"
                      @keyup.enter.native="submitForm"></el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <!--<span class="fa-tips"><i class="fa fa-lock"></i></span>-->
            <el-input class="area" type="password" placeholder="密码" v-model="loginForm.pwd"
                      @keyup.enter.native="submitForm"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm" class="submit_btn">登录</el-button>
          </el-form-item>
          <div class="tiparea">
            <p class="wxtip">温馨提示：请联系管理员创建账号</p>
          </div>
        </el-form>

      </section>
    </transition>
  </div>
</template>

<script>
  import {util} from '../../../common/util';
  export default {
    data(){
      return {
        loginForm: {
          mobile: '',
          pwd: ''
        },
        rules: {
          mobile: [{
            required: true,
            message: '用户名不能为空'
          }],
          pwd: [{
            required: true,
            message: '密码不能为空'
          }]
        }
      }
    },
    mounted(){
      container = document.createElement('div');
      this.$refs.can.appendChild(container);
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.z = 1000;
      scene = new THREE.Scene();
      particles = new Array();
      var PI2 = Math.PI * 2;
      var material = new THREE.ParticleCanvasMaterial({
        color: 0x0078de,
        program: function (context) {
          context.beginPath();
          context.arc(0, 0, 1, 0, PI2, true);
          context.fill();
        }
      });
      var i = 0;
      for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
          particle = particles[i++] = new THREE.Particle(material);
          particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
          particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
          scene.add(particle);
        }
      }
      renderer = new THREE.CanvasRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
      document.addEventListener('mousemove', onDocumentMouseMove, false);
      //
      window.addEventListener('resize', onWindowResize, false);
      animate();
    },
    methods: {
      submitForm() {
        this.$refs['loginForm'].validate(valid => {
          if (valid) {
            util.$ajax({
              url: '/api/user/login',
              data: this.loginForm,
              type: 'post'
            }, res => {
              if (+res.code === 1) {
                if ( + res.info.type === 1)  {
                  util.$error('学生用户不能登录后台!');
                  return;
                }
                util.$success('登录成功!');
                localStorage.setItem('token', res.token);
                localStorage.setItem('userInfo', JSON.stringify(res.info));

                setTimeout(() => {
                  this.$router.push({
                    path: '/index/classManage'
                  });
                }, 1000);
              }
            });
          } else {
            return false;
          }
        });

      }
    }
  }
  var SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;
  var container;
  var camera, scene, renderer;
  var particles, particle, count = 0;
  var mouseX = 0, mouseY = 0;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  // animate();
  function init() {
  }
  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  //
  function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
  }
  function onDocumentTouchStart(event) {
    if (event.touches.length === 1) {
      event.preventDefault();
      mouseX = event.touches[0].pageX - windowHalfX;
      mouseY = event.touches[0].pageY - windowHalfY;
    }
  }
  function onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
      event.preventDefault();
      mouseX = event.touches[0].pageX - windowHalfX;
      mouseY = event.touches[0].pageY - windowHalfY;
    }
  }
  //
  function animate() {
    requestAnimationFrame(animate);
    render();
  }
  function render() {
    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( -mouseY - camera.position.y ) * .05;
    camera.lookAt(scene.position);
    var i = 0;
    for (var ix = 0; ix < AMOUNTX; ix++) {
      for (var iy = 0; iy < AMOUNTY; iy++) {
        particle = particles[i++];
        particle.position.y = ( Math.sin(( ix + count ) * 0.3) * 50 ) + ( Math.sin(( iy + count ) * 0.5) * 50 );
        particle.scale.x = particle.scale.y = ( Math.sin(( ix + count ) * 0.3) + 1 ) * 2 + ( Math.sin(( iy + count ) * 0.5) + 1 ) * 2;
      }
    }
    renderer.render(scene, camera);
    count += 0.1;
  }
</script>

<style lang="less" scoped rel="stylesheet/less" type="text/less">
  .login_page {
    position: absolute;
    width: 100%;
    height: 100%;
    /*background: url(../assets/img/bg9.jpg) no-repeat center center;*/
    background-size: 100% 100%;
    min-width: 1200px;
  }

  .loginForm {
    background-color: #fff;
    padding: 20px;
    border-radius: 3px;
    box-shadow: 5px 5px 10px #01144c;
    .fa-tips {
      position: absolute;
      top: 0px;
      left: 10px;
      z-index: 20;
      color: #FF7C1A;
      font-size: 18px;
    }
  }

  .manage_tip {
    margin-bottom: 20px;
    .title {
      /*font-family: cursive;*/
      font-weight: bold;
      font-size: 26px;
      color: #fff;
    }
    .logo {
      width: 60px;
      height: 60px;
    }
  }

  .form_contianer {
    width: 370px;
    height: 370px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 25px;
    border-radius: 5px;
    text-align: center;
    .submit_btn {
      width: 100%;
      font-size: 16px;
      letter-spacing: 20px;
    }
  }

  .tiparea {
    text-align: left;
    font-size: 12px;
    color: #4cbb15;
    .tip {
      margin-left: 54px;
    }
  }

  .form-fade-enter-active, .form-fade-leave-active {
    transition: all 1s;
  }

  .form-fade-enter, .form-fade-leave-active {
    transform: translate3d(0, -50px, 0);
    opacity: 0;
  }

  .loginForm {
    .el-button--primary {
      background-color: #FF7C1A;
      border: 1px solid #FF7C1A;
    }
  }
  .el-input__inner {
    padding: 0 30px !important;
  }
</style>
