<template>
    <!-- 添加动态类以控制侧边栏状态 -->
    <div class="chat-view-container" :class="{ 'sidebar-collapsed': !isSidebarOpen && !isMobileView, 'mobile-sidebar-active': isMobileSidebarOpen }">
        <!-- 左侧垂直图标栏 (PC端显示) -->
        <div class="icon-sidebar" v-if="!isMobileView">
            <div class="icon-item main-icon">
                <el-avatar :size="36" class="blue-avatar" style="background-color: transparent;">
                     <svg width="60" color = "white"  height="60" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" stroke-width="1.5" class="h-2/3 w-2/3 text-black dark:text-white"><path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z" fill="currentColor"></path></svg>
                    <!-- <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" stroke-width="1.5" class="h-2/3 w-2/3 text-black dark:text-white"><path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z" fill="currentColor"></path></svg> -->
                </el-avatar>
            </div>
            <div class="icon-item">
                <el-icon><ChatRound /></el-icon>
            </div>
            <div class="icon-item">
                <el-icon><Refresh /></el-icon>
            </div>
           
            <div class="icon-item">
                <el-icon><Setting /></el-icon>
            </div>
           
         
            <div class="icon-item" style = "background-color: grey; border-radius: 100%;height: 20px;width: 20px;">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
    <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                    </svg>
                </div>
               
            <!-- 添加收起/展开侧边栏的按钮 -->
            <div class="icon-item" @click="toggleSidebar">
                <el-icon>
                    <Fold v-if="isSidebarOpen" />
                    <Expand v-else />
                </el-icon>
            </div>
             <!-- 添加暗黑模式切换按钮 -->
            
            <div class="icon-item bottom-icon">
                <el-icon><User /></el-icon>
            </div>
            <div style="background-color: transparent;" class="icon-item dark-mode-toggle" @click="toggleDarkMode">
                <div class="toggle-icon-wrapper">
                    <img style="height: 35px;width: 55px;" v-if="settingsStore.isDarkMode" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAACxUlEQVR4nO2ZsW7UQBCGLUBQ5IAGkVQgKACJBwEKoDp0BSgSUFnyyf5/Wy6dIlAgIhFCROAZkE48AUgkkPAUhBAQUJIiSQManSUsZy/n89msgfmk7daend+7szNjx1EURVEURVEURVEURRlCFEVHSXYAPAfwnuQ3krskf/7hsZvaXpO1yJpc1205dRGG4RSARQBbFpwtNGRtssZutztZmeOe5x0hOUPyh20HRxiy1hlZ+1jOAzhB8nUDHCq7I97Kzi3lvO/7FwGsN8QRWcdjAJeiKDpPciJJksNxHJ8ieRXAAwCbg54VX0ZyvtvtTjbBeQAbAG632+2Dw9Ysc4IguGkSIvXl5ChnfsW28yR7ZaJ6eku9MIiwXCgmsB/wbDv/KEmSA05J5FkA8wYR7u/7YBiGUw2I9r1xnM+KkN8JAHZ83z878CEAi7bPfJXJTHocPufsPBs4GZaTHAl4TsWQvJWzsWUUmWTHsvPrRaL9qCRJcsiwC27smYh+Pm1NALnnq3Y+49vDnK2lPZNIrtkUIAiCyzUKcC1n751JgO+Wj8C5ugRIM8asra8mlXZsClBnKZsmd1l72ypAHv7vR4D/cBAMw/D60CAIy9cggIW6BCA5V+Qa7NgUgOTHuhIhAF9yYrf3THRdt2U7FSZ5p2oBSE7nbEixN9HIYojkJ6lJqnLe87xj+a9v3P7ZTlADyuGXFZbDvdy7t0meaXxDBMB8BQ2RBcO7ZwtlTQCWbYsgO6HMcYjj+Ljhy8t4I43Uv60pugngbpHbIS17pw1nXt7zoXBTtKFt8Q2ST0heAXBBbiz5miRPp0nOnMnx0m3x7I8RAK9sCzDGWBn7N5nXr6Tu2a4WRxwS7WcLn/kiSDdVGooNSJb2G3KFLw296sbBdd2W9NQAPAWwKpWVjd0hNlPbq+la2gMzPEVRFEVRFEVRFEVRFOc3vwCXaQF84pJv4AAAAABJRU5ErkJggg==" alt="toggle-on" class="toggle-switch">
                    <img style="height: 35px;width: 55px;" v-else src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADUElEQVR4nO1ZTU8UQRAdNMoB9WSExI9EDkriD0E8apZwNEA4kMxm5r1dOC4x6MlgUFD0NxDiP9BEUVB/hIgkftyUBOGiqTCapenZ7fkEtV7SyWbTU+9VT3d1VY3nKRQKhUKhUCgUCoVCoVC0Qb1eP0lyCMATAG9IfiG5Q/JnyWMn4l4VLaJpfHz8hFcUarVaD4B5AJsH4KzTEG2isVqtdufmuO/7nSSnSH4/aAcTDNE6JdozOQ/gNMnnh8ChtDvilezcVM4HQXAFwFqM4TUAswD66/X6ZZJdMuS3/EfyfotnN2RepjfjeV4CvjXxJZHxarXaHWPwA4CblUrlaDsbMgfAMIB12yJMTEycy7IACfnElzNJzvyyxflFWfWkwiQyA1iy2HvXaDSOp3E2DR+Al04xgbsBz3z4rud5HRl0dQCYsSzCrQw2E/MBuNPyqVqt1mOJ9osZnW8WtefNANianJy8kINtV77tIAh6Y58AMG+e+TTbvs323HNGATzKy74LH8nHsRkejCRHAl7eokiOGBzfiszgLHybVj6SQ2bkdIn2SSE2o531hysMwxt587TiIzm4byJ28+nmBZgtShSAB4aghaK4nPlIrhoL0F+UIJIDZsZWFJeNj+Rr26SvhqhLRQmKssdmQZ+K4rLxAfi8bxKA7eZJRQYmsW0swI+iuJz5UOIC+L5/qswFcOLj/34EaATBMAyvFiUoDMNrZQZBk88aBGFcg1JiFiWI5FxZ2aCNL+4aHCorEbKkp9fz5mnFB6ASlzdvGhOH8xYEYLTMVNjki4q9LqdiCMB6nuKiemPDEPQwL/uOfAstO0E0ymEpKfMohxuNxhEATw3bWwDOZ7XtyifXH8mLaRoiM1kWIRJzz7QrXGltpuSbbvuw7/ud0j6yLMJSmuMQbUPzTch4OzY2diytkyn4Xji34KoxTdEomo4kaIqOWs6gjI9hGJ7Nw2EXPgDvnZuiLm3xqDssJeYAgD7ZGdEt0hdVXnO27uxv5/Noi7vypWqLN38YAfAsxpG/YSxn/kzm77bJb5vF0iEfEu2nc227B0HQKw3Fw/xxNLrCF9pedTnU1oOSvwNYkcrqIHaHcEbcK5GWSp4dbIVCoVAoFAqFQqFQKBTeP4tff/4aZ9FqC+MAAAAASUVORK5CYII=" alt="toggle-off" class="toggle-switch">
                </div>
            </div>
        
        </div>
        
        <!-- 左侧边栏 - 重新设计，模仿截图风格 -->
        <div class="sidebar" :class="{'sidebar-open-mobile': isMobileSidebarOpen}">
            <!-- 顶部搜索区域 -->
            <div class="sidebar-header">
                <div class="app-title">
                    <div class="mac-controls">
                        <span class="mac-btn mac-close"></span>
                        <span class="mac-btn mac-minimize"></span>
                        <span class="mac-btn mac-expand"></span>
                    </div>
                </div>
                <el-input
                    placeholder="Search"
                    prefix-icon="Search"
                    size="small"
                    class="search-input"
                />
                <div class="new-chat-wrapper">
                    <el-button type="primary" @click="handleNewChat" class="new-chat-btn" dark>
                        <el-icon><Plus /></el-icon>
                        <span>New Chat</span>
                        <el-icon><Edit /></el-icon>
                    </el-button>
                </div>
                
                <!-- 移动端专用功能按钮区域 -->
                <div class="mobile-actions" v-if="isMobileView">
                    <el-button class="mobile-action-btn theme-btn" @click="toggleDarkMode" title="Toggle Dark Mode">
                        <el-icon><Moon v-if="settingsStore.isDarkMode" /><Sunny v-else /></el-icon>
                    </el-button>
                    <el-button class="mobile-action-btn settings-btn" @click="toggleSettings" title="Settings">
                        <el-icon><Setting /></el-icon>
                    </el-button>
                </div>
            </div>
            
            <!-- 收藏的聊天 -->
            <div class="saved-chats">
                <div class="sidebar-label">
                    <el-icon><Star /></el-icon>
                    <span>Saved</span>
                </div>
                <div class="chat-item saved" @click="handleChatItemClick('saved')">
                    <div class="chat-icon" style="background-color: #6366f1;">C</div>
                    <span class="chat-title">ChatAI</span>
                    <el-button class="more-btn" type="text">
                        <el-icon><MoreFilled /></el-icon>
                    </el-button>
                </div>
            </div>
            
            <!-- 按日期分组的历史聊天 -->
            <div class="history-group">
                <div class="sidebar-label">
                    <span>Today</span>
                    <el-icon class="expand-icon"><ArrowDown /></el-icon>
                </div>
                
                <!-- 当前会话 -->
                <div class="chat-item" 
                     :class="{ 'active': historyStore.activeId === 'current' }" 
                     @click="handleChatItemClick('current')">
                    <div class="chat-icon" style="background-color: #06b6d4;">
                        <el-icon><ChatRound /></el-icon>
                    </div>
                    <span class="chat-title">{{ currentSessionTitle }}</span>
                    <el-dropdown trigger="click" @command="(cmd) => handleCurrentChatAction(cmd)">
                        <el-button class="more-btn" type="text" @click.stop>
                        <el-icon><MoreFilled /></el-icon>
                    </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="export">
                                    <el-icon><Download /></el-icon>导出对话
                                </el-dropdown-item>
                                <el-dropdown-item command="clear" divided>
                                    <el-icon><Delete /></el-icon>清空对话
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                
                <!-- 历史会话 - 过滤掉当前活跃的会话 -->
                <template v-if="historyStore.getAllRecords.length > 0">
                    <div v-for="chat in historyStore.getAllRecords" 
                        :key="chat.id" 
                        class="chat-item"
                        :class="{ 'active': historyStore.activeId === chat.id }"
                        @click="handleChatItemClick(chat.id)"
                    >
                        <div class="chat-icon" :style="{ backgroundColor: getRandomColor(chat.id) }">
                            {{ chat.title.charAt(0) }}
                        </div>
                        <span class="chat-title">{{ chat.title }}</span>
                        <el-dropdown trigger="click" @command="(cmd) => handleHistoryAction(cmd, chat)">
                        <el-button 
                            class="more-btn" 
                            type="text"
                            @click.stop
                        >
                            <el-icon><MoreFilled /></el-icon>
                        </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="export">
                                        <el-icon><Download /></el-icon>导出对话
                                    </el-dropdown-item>
                                    <el-dropdown-item command="delete" divided>
                                        <el-icon><Delete /></el-icon>删除对话
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </template>
                <div v-else class="empty-history">
                    <p>No saved conversations yet</p>
                </div>
            </div>
        </div>

        <!-- 移动端遮罩层 -->
        <div class="mobile-sidebar-overlay" :class="{active: isMobileSidebarOpen}" @click="toggleMobileSidebar"></div>

        <!-- 右侧主聊天区域 -->
        <div class="main-chat-area">
            <!-- 聊天头部 - 重新设计，更简洁 -->
            <div class="chat-header">
                <!-- 移动端左侧按钮组 -->
                <div class="header-left-actions" v-if="isMobileView">
                    <!-- 移动端汉堡按钮，使用新图标 -->
                    <button class="mobile-menu-button" @click="toggleMobileSidebar">
                    <svg style = "width: 20px ;height:auto;"data-v-a497a79e="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M896 192H128v128h768zm0 256H384v128h512zm0 256H128v128h768zM320 384 128 512l192 128z"></path></svg>
                    </button>
                </div>
                
                <!-- 左侧模型信息和状态区域 - 桌面端显示在左侧，移动端居中 -->
                <div class="header-left" :class="{'mobile-centered': isMobileView}">
                    <!-- 模型信息和设置 -->
                    <el-dropdown trigger="click" @command="handleModelChange">
                        <div class="model-info" style="cursor: pointer;">
                            <span class="model-name">{{ getModelDisplayName() }}</span>
                            <el-tag type="success" size="small" effect="dark" class="model-tag">
                                <div class="tag-content">
                                    <div class="status-indicator online"></div>
                                    <span>Online</span>
                                </div>
                            </el-tag>
                            <el-icon class="model-dropdown-icon"><ArrowDown /></el-icon>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item 
                                    v-for="model in modelOptions" 
                                    :key="model.value" 
                                    :command="model.value"
                                    :class="{ 'is-active': settingsStore.model === model.value }"
                                >
                                    {{ model.label }}
                                    <el-icon v-if="settingsStore.model === model.value"><Check /></el-icon>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                
                <!-- 中间标题区域 - 只在PC显示 -->
                <div class="header-center" v-if="!isMobileView">
                    <div class="conversation-info">
                        <span class="conversation-title">{{ currentChatTitle || 'New Chat' }}</span>
                        <div class="conversation-stats">
                            <span class="stats-item">
                                <el-icon><ChatDotRound /></el-icon>
                                {{ totalMessages }} messages
                            </span>
                        </div>
                    </div>
                </div>
                
                <!-- 右侧功能按钮 -->
                <div class="header-actions" :class="{'mobile-right-actions': isMobileView}">
                    
                    
                    <el-button class="share-btn" type="default" @click="handleShare">
                        <span class="button-text">Share</span>
                        <img style="width: 20px; height: 20px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAADQklEQVR4nO3cS4hOYRzH8e8Ycg255LYhFmo2kktJWFi6LOSSyG6QhYUFCyGLWVA0lBI1LpmkFBtWNCImt42NZGNlIxau4zJHp85keuuc9/X2PM/7P8/5ferZPj3n+fa+58w58x4QERERERERERERCWwMcAC4DpwE5oVegPwzGngOJMPGZ2CxNqk19tXEGBr3W7SeyruUE+RLZDvTBqwENgBzMOxGTpB0xGI60D/suH4ChzCqCkGu5RxfegFjTuxBRmRfv0lZosQehOyqMSlLlCoEuVgniKkoVQgyEXhZlihVCJKaDDxtIMopWqwqQYaiPLMepUpBShGlTEGmZffY1gIbgc1Njj3AV6vnFKtBRgKrgGNAH/ChgQ30MbqqHqQj+7p436IAtWMQWF3FIEuBW9kGJMZGd5WCTMkO+I+Bjc8bp6lIkE3ARwMbXjQGs3NZ1EFGAWcNbHYjI/qT+njgbhMb8xroBY4CncB2Xfa6uaf05D8i9GePmGfjzlTr97VCfUJGA/caDHEHWIF75mOEDNLbwEa8A9bj72rOfIxQQfY2sBG3s03zYVJZYoQI0gF8r7MR3dmjVl8ulyWG7yBtwIM6G3ECv9LQ38oSw3eQHXU24koWzad2YKAsMXwGaQfeFMz9ChhHGDfLEsNnkG0F8/4CFhHOzJqT+m/gCEb5CvKozkk8tPRcsgbYAszFMB9BFhTcRk+vuGY5XH90fAQ5XDDnOYdrj5KPIH0Fcy5xuPYouQ4yFviRM99bx2uPkusgywrmO+947VFyHWRnwXy7HK89Sq6DHC+Yb7njtUfJdZCiR7MzHK89Sq6D5P1mMQl4q6TUXAcpmq/N8dqjFDKINEBBjFEQYxTEGAUxRkGMURBjFMQYBTFGQYxREGMUxBgFMUZBjFEQYxQk8iAXcub65Hjd0XIdZF3OXD2O1x0tH0/4umr+t/exx5+rRcfXI9f5wNbs5cV6lm4giDRJQYxREGMUxBgFMUZBShSkymMg+/vJx0twFITmw6Svk12oIJgaZ0IG6TFwwInxkb4JIpjdBg44MT4OhgySvpDyoYGDToyOF8CEkEGGonRmX1/pVZcGXAX261dfIiIiIiIiIiIiQmh/AenAVRtFBnygAAAAAElFTkSuQmCC" alt="share-3">
                    </el-button>
                    <el-button class="config-btn" type="default" @click="toggleSettings" style="background-color: black;" v-if="!isMobileView">
                        <span style="color: white" class="button-text">Settings</span>
                        <el-icon style="color: white" ><Setting /></el-icon>
                    </el-button>
                    
                    <!-- 移除New下拉按钮，只在PC端显示 -->
                </div>
            </div>
            
            <!-- 添加滚动到底部按钮 -->
            <div 
                class="scroll-to-bottom-btn" 
                :class="{ 'visible': showScrollButton }"
                @click="() => scrollToBottom(true)"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="7 13 12 18 17 13"></polyline>
                    <polyline points="7 6 12 11 17 6"></polyline>
                </svg>
            </div>
            
            <!-- 消息容器 -->
            <div class="messages-container" ref="messagesContainer" @scroll="handleMessagesScroll">
                <template v-if="messages.length">
                    <chat-message 
                        v-for="message in messages" 
                        :key="message.id" 
                        :message="message"
                        :is-latest-message="isLatestAIMessage(message)"
                        :message-stream-finished="message.messageStreamFinished"
                        @update="handleMessageUpdate" 
                        @delete="handleMessageDelete" 
                        @regenerate="handleRegenerate" 
                        @questionSelected="handleQuestionSelected"
                        @messageRenderComplete="handleMessageRenderComplete"
                    />
                </template>
                <div v-else class="empty-state">
                    <div class="welcome-container">
                        <el-avatar :size="60" class="blue-avatar"style = "background:transparent">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50">
<path fill="black" d="M 25 1 A 2.5 2.5 0 0 0 22.509766 3.2851562 L 7.2539062 12.119141 A 2.5 2.5 0 0 0 6.5 12 A 2.5 2.5 0 0 0 5 16.498047 L 5 33.503906 A 2.5 2.5 0 0 0 6.5 38 A 2.5 2.5 0 0 0 7.2558594 37.882812 L 22.513672 46.716797 A 2.5 2.5 0 0 0 25 49 A 2.5 2.5 0 0 0 27.490234 46.714844 L 42.746094 37.880859 A 2.5 2.5 0 0 0 43.5 38 A 2.5 2.5 0 0 0 45 33.501953 L 45 16.496094 A 2.5 2.5 0 0 0 43.5 12 A 2.5 2.5 0 0 0 42.744141 12.117188 L 27.486328 3.2832031 A 2.5 2.5 0 0 0 25 1 z M 22.265625 5.7402344 L 15.130859 18.128906 L 8.9960938 14.578125 A 2.5 2.5 0 0 0 8.8027344 13.533203 L 22.265625 5.7402344 z M 27.734375 5.7402344 L 41.197266 13.533203 A 2.5 2.5 0 0 0 41.001953 14.580078 L 34.869141 18.128906 L 27.734375 5.7402344 z M 8.1347656 16.390625 L 14.134766 19.865234 L 15.136719 18.134766 L 23.519531 22.990234 C 23.939531 22.690234 24.45 22.5 25 22.5 C 25.55 22.5 26.060469 22.690234 26.480469 22.990234 L 34.863281 18.134766 L 35.865234 19.865234 L 41.867188 16.390625 A 2.5 2.5 0 0 0 43 16.947266 L 43 32.253906 L 35.869141 19.869141 L 27.470703 24.720703 C 27.480703 24.820703 27.5 24.91 27.5 25 C 27.5 26.02 26.88 26.899062 26 27.289062 L 26 37 L 40.275391 37 L 26.822266 44.789062 A 2.5 2.5 0 0 0 26 44.210938 L 26 37 L 24 37 L 24 44.210938 A 2.5 2.5 0 0 0 23.177734 44.789062 L 9.7246094 37 L 24 37 L 24 27.289062 C 23.12 26.899062 22.5 26.02 22.5 25 C 22.5 24.91 22.519297 24.820703 22.529297 24.720703 L 14.130859 19.869141 L 7 32.253906 L 7 16.949219 A 2.5 2.5 0 0 0 8.1347656 16.390625 z"></path>
</svg>
                </el-avatar>
                        <h1 class="welcome-title">Hi, there 👋</h1>
                        <p class="welcome-subtitle">Tell us what you need, and we'll handle the rest.</p>
                        
                        <!-- 任务卡片区域 -->
                        <div class="task-cards">
                            <div class="task-card">
                                <div class="task-card-avatar">
                                    <el-avatar :size="36" style="background-color: #444;">S</el-avatar>
                                </div>
                                <div class="task-card-content">
                                    <div class="task-card-header">Data Assistant</div>
                                    <div class="task-card-description">
                                        Designed to help manage sales processes and maximize customer engagement.
                                    </div>
                                </div>
                            </div>
                            
                            <div class="task-suggestions">
                                <div class="task-item">
                                    <el-icon><Document /></el-icon>
                                    <span>Answer RFP documentation</span>
                                </div>
                                <div class="task-item">
                                    <el-icon><DataAnalysis /></el-icon>
                                    <span>Conduct a competitor analysis</span>
                                </div>
                                <div class="task-item">
                                    <el-icon><Message /></el-icon>
                                    <span>Provide feedback on communication</span>
                                </div>
                                
                                <div class="task-footer">
                                    <span>Tasks</span>
                                    <el-button type="text">View All</el-button>
                                </div>
                            </div>
                            
                            <div class="prompt-suggestion">
                                <div class="prompt-header">
                                    <div class="prompt-text">What are the key benefits of Product 1 that I should highlight to potential clients?</div>
                                    <el-button type="text" class="prompt-more">
                                        <el-icon><MoreFilled /></el-icon>
                                    </el-button>
                                </div>
                                <div class="prompt-footer">Suggested prompt</div>
                            </div>
                        </div>
                        
                        <!-- 快速操作按钮 -->
                        <div class="quick-actions">
                            <el-button class="action-button">
                                <el-icon><Calendar /></el-icon>
                                Connect Calendar
                            </el-button>
                            <el-button class="action-button">
                                <el-icon><TrendCharts /></el-icon>
                                Demo Task
                            </el-button>
                            <el-button class="action-button">
                                <el-icon><Connection /></el-icon>
                                Browse Integrations
                            </el-button>
                            <el-button class="action-button">
                                <el-icon><Notebook /></el-icon>
                                Shared in Notes
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 聊天输入框 -->
            <chat-input 
                ref="chatInputRef"
                :loading="isLoading" 
                @send="handleSend"
                @clear="handleClear"
                @role-selected="handleRoleSelected"
                @pause="handlePauseGeneration"
                class="modern-chat-input"
            />
            
            <!-- 底部免责声明 -->
            <!-- <div class="disclaimer">
                Centra may display inaccurate info, so please double check the response. 
                <el-link type="primary">Your Privacy & Orbita GPT</el-link>
            </div> -->
        </div>

        <!-- 设置对话框 -->
        <el-dialog
            v-model="showSettings"
            title="Settings"
            width="400px"
            :close-on-click-modal="false"
            :show-close="true"
            destroy-on-close
            class="settings-dialog"
        >
            <el-form :model="settingsForm" label-position="top" class="settings-form">
                <!-- Removing dark mode section -->
                <!-- <el-divider content-position="left">Appearance</el-divider>
                <el-form-item label="Dark Mode">
                    <el-switch
                        v-model="settingsStore.isDarkMode"
                        @change="handleDarkModeChange"
                    />
                </el-form-item> -->
                
                <el-divider content-position="left">Model Configuration</el-divider>
                <el-form-item label="Model">
                    <el-select v-model="settingsForm.model" class="w-full">
                        <el-option
                            v-for="model in modelOptions"
                            :key="model.value"
                            :label="model.label"
                            :value="model.value"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="Add Custom Model">
                    <div class="custom-model-input">
                        <el-input 
                            v-model="customModelInput" 
                            placeholder="Enter custom model name" 
                            class="custom-model-field"
                        />
                        <el-button 
                            type="primary" 
                            @click="addCustomModel" 
                            :disabled="!customModelInput.trim()"
                            size="default"
                        >
                            Add
                        </el-button>
                    </div>
                    <div class="form-item-tip">
                        Add your own model names to use with compatible API endpoints
                    </div>
                    
                    <!-- Show custom model tags if any exist -->
                    <div v-if="customModels.length > 0" class="custom-models-list">
                        <el-tag
                            v-for="(model, index) in customModels"
                            :key="index"
                            closable
                            @close="removeCustomModel(index)"
                            class="custom-model-tag"
                        >
                            {{ model.label }}
                        </el-tag>
                    </div>
                </el-form-item>

                <!-- Temperature slider stays as is -->
                <el-form-item label="Temperature">
                    <el-slider
                        v-model="settingsForm.temperature"
                        :min="0"
                        :max="1"
                        :step="0.1"
                        show-input
                    />
                </el-form-item>
                <el-form-item label="Max Tokens">
                    <el-input-number
                        v-model="settingsForm.maxTokens"
                        :min="1"
                        :max="4096"
                        :step="1"
                    />
                </el-form-item>
                <el-form-item label="Top P">
                    <el-slider
                        v-model="settingsForm.topP"
                        :min="0"
                        :max="1"
                        :step="0.1"
                        show-input
                    />
                </el-form-item>
                <el-form-item label="Top K">
                    <el-input-number
                        v-model="settingsForm.topK"
                        :min="1"
                        :max="100"
                        :step="1"
                    />
                </el-form-item>
                
                <el-divider content-position="left">API Credentials</el-divider>
                <el-form-item label="API Key" required>
                    <el-input
                        v-model="settingsForm.apiKey"
                        type="password"
                        show-password
                        placeholder="Enter your API Key"
                        :class="{ 'is-error': !settingsStore.actualApiKey }"
                    />
                    <div class="form-item-tip" v-if="!settingsStore.actualApiKey">
                        API Key is required - either enter here or set in environment variables
                    </div>
                    <div class="form-item-tip">
                        <strong>Your custom settings will be used instead of environment variables.</strong><br/>
                        Custom API Keys entered here are not saved to browser storage for security.
                        You'll need to re-enter them if the app is refreshed.
                    </div>
                </el-form-item>
                
                <el-form-item label="API Endpoint">
                    <el-input
                        v-model="settingsForm.apiEndpoint"
                        placeholder="API Endpoint URL"
                    />
                    <div class="form-item-tip">
                        Default: https://api.openai.com/v1/chat/completions
                    </div>
                    <div class="form-item-tip">
                        <strong>Your custom endpoint will be used instead of environment variables.</strong><br/>
                        Custom endpoints are not saved to browser storage for security.
                    </div>
                    <el-button 
                        type="primary" 
                        size="small" 
                        class="parse-models-btn" 
                        @click="parseModels"
                        :loading="isParsingModels"
                    >
                        Parse Available Models
                    </el-button>
                </el-form-item>
                
                <el-form-item label="Stream Response">
                    <el-switch
                        v-model="settingsForm.streamResponse"
                    />
                    <div class="form-item-tip">Show AI responses in real-time</div>
                </el-form-item>
                
                <el-form-item label="当前角色提示词" v-if="settingsStore.currentRole">
                    <div class="current-role-info">
                        <div class="role-name">{{ settingsStore.currentRole.name }}</div>
                        <div class="role-prompt">{{ settingsStore.currentRole.prompt }}</div>
                        <el-button 
                            type="text" 
                            @click="clearCurrentRole" 
                            size="small"
                        >
                            清除当前角色
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="showSettings = false">Cancel</el-button>
                    <el-button type="primary" @click="saveSettings">
                        Save
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted, watch, nextTick, h } from 'vue'
import { useChatStore } from '../stores/chat'
import { useSettingsStore, fetchModelList } from '../stores/settings'
import { useHistoryStore } from '../stores/history'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ElLoading } from 'element-plus'
import ChatMessage from '../components/ChatMessage.vue'
import ChatInput from '../components/ChatInput.vue'
import { useElementSize, useThrottleFn } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import { messageHandler } from '../utils/messageHandler'
import { getModelsList, checkBackendAvailability } from '../utils/apiService'
import { storeToRefs } from 'pinia'
import { ArrowDown, Menu, Check, ArrowLeft, Setting, Plus, Edit, Star, Search, MoreFilled, ChatRound, User, Delete, Expand, Fold, Moon, Sunny, ArrowUp, InfoFilled, Download, Position, More, VideoPause, Close, Link } from '@element-plus/icons-vue'

// 状态管理
const chatStore = useChatStore()
const settingsStore = useSettingsStore()
const historyStore = useHistoryStore()

// 组件引用
const chatInputRef = ref(null)

// 移动端检测 - 改进检测方法
const isMobileView = ref(window.innerWidth <= 768)
const isMobileSidebarOpen = ref(false)

// 监听窗口大小变化来改变移动端视图状态
const handleResize = () => {
    isMobileView.value = window.innerWidth <= 768
    
    // 当从移动端切换到桌面端时，确保sidebar正确显示
    if (!isMobileView.value) {
        isMobileSidebarOpen.value = false
    }
}

// 移动端侧边栏切换
const toggleMobileSidebar = () => {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value
    // 添加/移除body的overflow以防止背景滚动
    if (isMobileSidebarOpen.value) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
}

// 添加窗口大小变化监听
onMounted(() => {
    // 窗口大小事件监听
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // 暴露测试API函数到window对象，方便在控制台中调用
    window.testApiSettings = () => {
      console.log('===== 测试API设置 =====');
      console.log('userCustomizedAPI:', settingsStore.userCustomizedAPI);
      console.log('apiKey:', settingsStore.apiKey ? '已设置 (长度: ' + settingsStore.apiKey.length + ')' : '未设置');
      console.log('apiEndpoint:', settingsStore.apiEndpoint);
      console.log('actualApiKey:', settingsStore.actualApiKey ? '已设置 (长度: ' + settingsStore.actualApiKey.length + ')' : '未设置');
      console.log('actualApiEndpoint:', settingsStore.actualApiEndpoint);
      console.log('===== 测试API设置结束 =====');
      
      // 返回结果，方便链式调用
      return {
        isCustomApiEnabled: settingsStore.userCustomizedAPI,
        hasApiKey: !!settingsStore.apiKey,
        apiEndpoint: settingsStore.apiEndpoint,
        actualApiKey: !!settingsStore.actualApiKey,
        actualApiEndpoint: settingsStore.actualApiEndpoint
      };
    };
    
    // 暴露测试后端API可用性的函数
    window.testBackendApi = async () => {
      console.log('===== 测试后端API可用性 =====');
      const { forceCheckBackendAvailability } = await import('../utils/apiService');
      const isAvailable = await forceCheckBackendAvailability();
      console.log('后端API是否可用:', isAvailable);
      console.log('===== 测试后端API可用性结束 =====');
      return isAvailable;
    };
    
    // Migrate old chat history to new format if needed
    migrateOldChatHistory();
    
    // Load current chat
    const savedCurrentChat = localStorage.getItem('currentChat');
    if (savedCurrentChat) {
        try {
            const savedMessages = JSON.parse(savedCurrentChat);
            if (savedMessages.length > 0) {
                // Load messages to the chat store if we're in current session
                if (historyStore.isCurrentSession) {
                    chatStore.setMessages(savedMessages);
                }
                
                // Update the current session title
                updateCurrentSessionTitle(savedMessages);
            }
        } catch (e) {
            console.error('加载当前聊天失败:', e);
            currentSessionTitle.value = '新对话';
            currentChatTitle.value = '新对话';
        }
    } else {
        currentSessionTitle.value = '新对话';
        currentChatTitle.value = '新对话';
    }
    
    // 初始化滚动状态
    nextTick(() => {
        if (messagesContainer.value) {
            scrollToBottom();
            handleScroll();
        }
    });
})

// 移除监听
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    // 确保body overflow被还原
    document.body.style.overflow = ''
    
    // 清除滚动定时器
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
})

const messages = computed(() => chatStore.messages)
const isLoading = computed(() => chatStore.isLoading)
const messagesContainer = ref(null)

const totalMessages = computed(() => chatStore.messages.length); // Add this line

// 添加一个更新触发器，用于强制更新模型列表
const modelOptionsLastUpdated = ref(Date.now())

// 添加模型选项的计算属性，以确保下拉菜单始终显示最新数据
const modelOptions = computed(() => {
    // 依赖 modelOptionsLastUpdated 以确保在值更新时重新计算
    const _ = modelOptionsLastUpdated.value;
    return settingsStore.modelOptions;
})

// 侧边栏状态
const isSidebarOpen = ref(true) // 默认打开

// 设置面板状态
const showSettings = ref(false)
const isParsingModels = ref(false)

// 添加本地表单状态对象，用于处理设置表单的数据
const settingsForm = ref({
    apiKey: '',
    apiEndpoint: '',
    model: '',
    temperature: 0.7,
    maxTokens: 1000,
    topP: 0.7,
    topK: 50,
    streamResponse: true,
    systemPrompt: ''
})

// 当设置面板打开时，初始化表单数据
const initSettingsForm = () => {
    settingsForm.value = {
        apiKey: settingsStore.displayApiKey,
        apiEndpoint: settingsStore.displayApiEndpoint,
        model: settingsStore.model,
        temperature: settingsStore.temperature,
        maxTokens: settingsStore.maxTokens,
        topP: settingsStore.topP,
        topK: settingsStore.topK,
        streamResponse: settingsStore.streamResponse
        // 已移除 systemPrompt 字段
    }
}

// 监听设置面板的显示状态，打开时初始化表单
watch(() => showSettings.value, (newValue) => {
    if (newValue) {
        initSettingsForm()
    }
})

// 聊天历史记录
// const chatHistory = ref([])
const currentChatTitle = ref('新对话')
// 追踪当前活跃的历史记录ID
// const activeHistoryId = ref('current')
historyStore.activeId
// Dedicated state for the "current, unsaved" session
const currentSessionMessages = ref([]); 
const currentSessionTitle = ref('新对话'); // For SIDEBAR "Current Chat" ITEM's title

// 用于中断请求的控制器 - 确保它在全局作用域中定义
const activeController = ref(null);

// 处理建议问题选择
const handleQuestionSelected = (question) => {
  console.log('[ChatView] 处理建议问题选择:', question);
  if (!question) return;
  
  // 直接发送这个问题
  handleSend(question);
}

// 处理消息渲染完成事件
const handleMessageRenderComplete = (message) => {
  console.log(`[ChatView] 收到消息渲染完成事件，消息ID: ${message.id}`);
  
  // 确保这是AI消息且消息已完成
  if (message.role === 'assistant' && message.completed) {
    // 使用延迟确保在渲染完成后再生成建议问题
    setTimeout(() => {
      console.log(`[ChatView] 开始为消息ID ${message.id} 生成建议问题`);
      generateSuggestedQuestions(message);
    }, 5000); // 延迟短一点，因为消息已经确认渲染完成
  }
}

// 发送消息方法
const handleSend = async (content) => {
  console.log('[ChatView] handleSend received content:', content ? content.substring(0, 50) + '...' : '(empty)');
  if (!content || !content.trim()) {
    console.warn('[ChatView] handleSend received empty content. Aborting.');
    return;
  }

  // 重置暂停状态，确保新消息可以正常处理
  isStreamPaused.value = false;

  // If already loading, prevent sending another message
  if (chatStore.isLoading && !isStreamPaused.value) {
      ElMessage.warning('已有消息正在处理中，请稍后再试');
      return;
  }

  // If there's an active controller, abort it first
  if (activeController.value) {
    console.log('[ChatView] Aborting existing request before sending new message');
    activeController.value.abort();
    activeController.value = null;
    
    // 清除之前消息的状态
    const lastMessage = chatStore.messages[chatStore.messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.completed) {
      lastMessage.loading = false; 
      lastMessage.completed = true;
    }
  }
  
  let result = null; // Initialize result
  chatStore.isLoading = true; // Set loading state immediately

  try {
    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: content,
      timestamp: new Date().toISOString()
    };
    // 添加用户消息并手动更新token计数
    chatStore.messages.push(userMessage);
    if (userMessage.role === 'user') {
      const promptTokens = messageHandler.countTokens(userMessage.content);
      // 保存token计数到消息对象
      userMessage.tokenCount = promptTokens;
      // 更新全局token计数
      chatStore.tokenCount.prompt += promptTokens;
      chatStore.tokenCount.total += promptTokens;
    }
    console.log('[ChatView] User message added to store');
    
    // Add empty assistant message placeholder with a guaranteed different ID
    const newAssistantMessage = {
      id: Date.now() + Math.floor(Math.random() * 1000), // 使用时间戳+随机数确保唯一性
      role: 'assistant',
      content: '',
      reasoningContent: '', // Ensure this property is initialized
      timestamp: new Date().toISOString(),
      startTimestamp: Date.now(), // 记录开始时间戳
      firstResponseTime: null, // 首次数据包接收时间，用于计算网络请求延迟（从发送到首包）
      completed: false,
      loading: true // 添加loading状态
    };
    chatStore.messages.push(newAssistantMessage);
    console.log('[ChatView] Empty assistant message added to store');

    // Scroll to bottom after adding messages
    await nextTick();
    scrollToBottom(true);//发送消息后滚动到底部
    
    // Prepare messages for API
    const apiMessages = prepareMessagesForAPI();
    
    // Validate API messages
    if (apiMessages.length === 0) {
      console.error('[ChatView] Error: Prepared API messages are empty');
      ElMessage.error('消息准备失败: 消息为空');
      throw new Error('Prepared API messages are empty'); 
    }

    // 创建认证选项对象，包含API密钥和端点
    const authOptions = {
      apiKey: settingsStore.actualApiKey,
      apiEndpoint: settingsStore.actualApiEndpoint,
      userCustomizedAPI: settingsStore.userCustomizedAPI
    };

    // 添加调试日志
    console.log('[ChatView] 发送请求前API设置:', {
      userCustomizedAPI: settingsStore.userCustomizedAPI,
      apiKeySet: !!settingsStore.apiKey,
      apiEndpointSet: !!settingsStore.apiEndpoint,
      actualApiKey: settingsStore.actualApiKey ? '已设置' : '未设置',
      actualApiEndpoint: settingsStore.actualApiEndpoint
    });

    // 使用后端API发送消息，现在传递authOptions
    result = await messageHandler.sendMessageViaBackend(
      apiMessages,
      {
        model: settingsStore.model,
        temperature: settingsStore.temperature,
        max_tokens: settingsStore.maxTokens,
        stream: settingsStore.streamResponse
      },
      (updatedContent, done) => {
        // 检查是否已暂停，如果暂停则不更新内容
        if (isStreamPaused.value) {
          console.log('[ChatView] Stream paused, skipping update');
          return;
        }
        
        // Update message content
        const lastMessage = chatStore.messages[chatStore.messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          // 首次接收到内容时记录时间
          if (lastMessage.loading && !lastMessage.firstResponseTime) {
            lastMessage.firstResponseTime = Date.now();
            console.log(`[ChatView] 首个数据包接收时间: ${lastMessage.firstResponseTime - lastMessage.startTimestamp}ms`);
          }
          
          // 第一次收到内容时移除loading状态
          if (lastMessage.loading) {
            lastMessage.loading = false;
          }
          
          if (typeof updatedContent === 'object') {
            if (updatedContent.content !== undefined) {
              lastMessage.content = updatedContent.content;
            }
            if (updatedContent.reasoningContent !== undefined) {
              // Ensure reasoningContent property exists and is updated
              if (!lastMessage.reasoningContent) {
                lastMessage.reasoningContent = '';
              }
              lastMessage.reasoningContent = updatedContent.reasoningContent;
            }
          } else if (updatedContent && updatedContent.length > 0) {
            lastMessage.content = updatedContent;
          }
          
          // Auto-scroll if content changed and user is near bottom
          if(isScrolledToBottom()) {
            nextTick(() => scrollToBottom(true));
          }
        } else {
          console.error('[ChatView Send] Cannot find assistant message to update');
        }
        
        if (done) {
          const lastMessage = chatStore.messages[chatStore.messages.length - 1];
          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.completed = true;
            lastMessage.messageStreamFinished = true; // 标记流式输出已完成
            
            // 计算响应时间
            if (lastMessage.startTimestamp) {
              const endTime = Date.now();
              lastMessage.responseTime = endTime - lastMessage.startTimestamp; // 总响应时间（从发送到完全接收完成）
            }
            
            const promptTokens = messageHandler.countTokens(apiMessages.filter(m => m.role !== 'assistant').map(m => m.content).join(''));
            const completionTokens = messageHandler.countTokens(typeof updatedContent === 'object' ? updatedContent.content || '' : updatedContent || '');
            
            // 保存token数量到消息对象，便于UI显示
            lastMessage.tokenCount = completionTokens;
            
            // 更新全局token计数
            chatStore.updateTokenCount(promptTokens, completionTokens);
            
            // 生成相关建议问题
            generateSuggestedQuestions(lastMessage);
            
            console.log(`[ChatView] 消息发送完成，Prompt Tokens: ${promptTokens}, Completion Tokens: ${completionTokens}, 总计: ${promptTokens + completionTokens}, 响应时间: ${lastMessage.responseTime}ms`);
          }
        }
      },
      false, // isRegeneration = false
      authOptions // 新增认证选项
    );
    
    // 保存controller以便可能的中断
    if (result?.controller) {
      activeController.value = result.controller;
    }
  } catch (error) {
    console.error('[ChatView Send] Error:', error);
    ElMessage.error(`发送消息失败: ${error.message || '未知错误'}`);
    
    // 移除最后一条空的助手消息
    const lastMessage = chatStore.messages[chatStore.messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.content === '') {
      chatStore.messages.pop();
    }
  } finally {
    // 重置加载状态，除非请求被中断
    if (!result?.aborted) {
      chatStore.isLoading = false;
      activeController.value = null;
    }
  }
};

// 处理会话项点击
// src/views/ChatView.vue

// ... 其他代码 ...

// 处理会话项点击
const handleChatItemClick = (chatId) => {
  console.log(`[ChatView] Clicked on chat: ${chatId}`);
  
  // Add debug info
  historyStore.debugState();
  
  // If already the active chat, do nothing
  if (chatId === historyStore.activeId) {
    console.log('[ChatView] Already on this chat, ignoring click');
    return;
  }
  
  // Save current session messages if needed before switching
  if (historyStore.isCurrentSession && chatStore.messages.length > 0) {
    // Only save to localStorage, don't create a history record yet
    localStorage.setItem('currentChat', JSON.stringify(chatStore.messages));
    console.log('[ChatView] Saved current session to localStorage before switching');
  }
  
  // Switch to selected chat
  const success = historyStore.setActiveRecord(chatId);
  console.log(`[ChatView] setActiveRecord result: ${success ? 'success' : 'failed'}`);
  
  // Update UI title based on what we switched to
  if (chatId === 'current') {
    currentChatTitle.value = currentSessionTitle.value;
    console.log('[ChatView] Switched to current session with title:', currentSessionTitle.value);
  } else {
    const record = historyStore.getRecordById(chatId);
    if (record) {
      currentChatTitle.value = record.title;
      console.log('[ChatView] Switched to history record:', record.title);
    }
  }
};

// ... 其他代码 ...

// 处理新建对话
const handleNewChat = () => {
  // 如果已经是空的当前会话，则不做任何处理
  if (historyStore.isCurrentSession && chatStore.messages.length === 0) {
    console.log('[ChatView] Already in empty session, no action needed');
    return;
  }
  
  // 如果当前有消息且是当前会话，则保存到历史记录
  if (chatStore.messages.length > 0 && historyStore.isCurrentSession) {
    const title = currentSessionTitle.value || '新对话';
    historyStore.saveCurrentAsHistory(title);
    console.log('[ChatView] Saved current session as history record:', title);
  } 
  // else: if viewing history, no need to save anything
  
  // Clear messages first
  chatStore.clearMessages();
  
  // Clear localStorage current chat
  localStorage.removeItem('currentChat');
  
  // Then switch to current (prevents loading from localStorage since we just removed it)
  historyStore.setActiveRecord('current');
  
  // Update UI state
  currentSessionMessages.value = [];
  currentSessionTitle.value = '新对话';
  currentChatTitle.value = '新对话';
  
  console.log('[ChatView] Created new empty chat');
  ElMessage.success('已新建对话');
}

// 处理历史记录操作
// 处理历史记录操作
// src/views/ChatView.vue

// ... 其他代码 ...

const handleHistoryAction = (command, chat) => {
  switch (command) {
    case 'export':
      if (chat && chat.id) {
        // 确保传递整个chat对象给exportChat
        exportChat(chat);
      } else {
        ElMessage.warning('无法导出该对话，数据不完整');
        console.error('Export failed, invalid chat object:', chat);
      }
      break;
    case 'delete':
      // 实现删除对话功能
      handleDeleteChat(chat.id);
      break;
    default:
      console.log('Unknown command:', command);
  }
};

// ... 其他代码 ...
// 保存消息 - 更新为使用新的历史记录系统
const saveMessages = () => {
  // Only save messages if we're in the current session
  if (historyStore.isCurrentSession) {
    // Save to localStorage for current session persistence
    localStorage.setItem('currentChat', JSON.stringify(chatStore.messages));
    
    // Update current session title
    updateCurrentSessionTitle(chatStore.messages);
  } else {
    // If we're viewing a history record, update it with any changes
    // 在只是查看而没有实际修改内容时，不更新时间戳，避免排序变化
    historyStore.updateRecord(
      historyStore.activeId, 
      {
        messages: JSON.parse(JSON.stringify(chatStore.messages)),
        tokenCount: { ...chatStore.tokenCount }
      },
      false // 不更新时间戳，保持记录在列表中的位置
    );
  }
};

// 新增：处理刷新按钮点击
const handleRefresh = () => {
    console.log('刷新聊天');
    ElMessage.info('刷新聊天功能已触发');
    // 简单实现：清空消息列表
    handleClear();
}

// 新增：处理分享按钮点击
const handleShare = () => {
    console.log('分享聊天');
    
    if (messages.value.length === 0) {
        ElMessage.warning('没有可分享的内容');
        return;
    }
    
    // 模拟分享功能
    try {
        const chatContent = messages.value.map(m => 
            `[${m.role}]: ${m.content}`
        ).join('\n\n');
        
        navigator.clipboard.writeText(chatContent)
            .then(() => {
                ElMessage.success('对话内容已复制到剪贴板');
            })
            .catch(err => {
                console.error('复制失败:', err);
                ElMessage.error('分享失败，无法复制内容');
            });
    } catch (error) {
        console.error('分享错误:', error);
        ElMessage.error('分享功能出错');
    }
}

// 添加isStreamPaused的定义
const isStreamPaused = ref(false);

// 处理暂停消息生成
const handlePauseGeneration = () => {
    console.log('[ChatView] handlePauseGeneration called');
  
    // 设置暂停状态
    isStreamPaused.value = true;
  
    // 取消进行中的请求
    if (activeController.value) {
        try {
            console.log('[ChatView] Aborting active request...');
            activeController.value.abort('用户手动暂停');  // 传入中断原因
            activeController.value = null;
            console.log('[ChatView] Request aborted');
        } catch (error) {
            console.error('[ChatView] Error aborting request:', error);
        }
    }
    
    // 立即清除加载状态
    chatStore.isLoading = false;
    
    // 清除任何正在生成中的消息状态
    const lastMessage = chatStore.messages[chatStore.messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.completed) {
        // 将未完成的消息标记为已完成，以停止加载动画
        lastMessage.loading = false;
        lastMessage.completed = true;
        console.log('[ChatView] Marked last message as completed');
    }
    
    // 显示通知
    ElMessage({
        message: '已暂停生成',
        type: 'info',
        duration: 2000
    });
    
    // 暂时不自动清除暂停状态，确保真正暂停
    // 在下一次用户交互时再重置状态
}

// 滚动到底部的辅助函数
const scrollToBottom = (forceScroll = false) => {
  if (messagesContainer.value) {
    const { scrollHeight, scrollTop, clientHeight } = messagesContainer.value;
    // 定义一个阈值（像素），用于判断用户是否接近底部
    const SCROLL_THRESHOLD = 100; // 增加到250px，使得滚动跟随范围更大
    // 检查用户是否在阈值范围内，或者是否强制滚动
    const isUserNearBottom = scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD;

    if (forceScroll || isUserNearBottom) {
      // 使用requestAnimationFrame优化滚动性能，防止频繁滚动导致卡顿
      if (window._scrollAnimationFrame) {
        cancelAnimationFrame(window._scrollAnimationFrame);
      }
      
      window._scrollAnimationFrame = requestAnimationFrame(() => {
      messagesContainer.value.scrollTo({
        top: messagesContainer.value.scrollHeight,
          // 对于AI流式输出，使用auto而不是smooth，减少动画开销
          behavior: forceScroll ? 'smooth' : 'auto'
        });
      });
      // console.log('已滚动到底部。强制:', forceScroll, '用户接近底部:', isUserNearBottom);
    } else {
      // console.log('未滚动到底部，用户不在底部附近。');
    }
  }
};

// 处理角色选择
const handleRoleSelected = (role) => {
  console.log('选择角色:', role);
  // 存储当前选择的角色到设置中
  settingsStore.currentRole = {
    name: role.name,
    prompt: role.prompt
  };
  // 不需要重新发送消息，只需要更新系统状态
  ElMessage.success({
    message: `已设置角色: ${role.name}`,
    description: '该角色提示词将作为系统指令发送给AI，取代系统提示词设置'
  });
}

// 准备发送给API的消息
const prepareMessagesForAPI = () => {
  // 创建消息数组的副本
  const apiMessages = [];
  
  // 添加系统提示词（如果有）
  if (settingsStore.currentRole?.prompt) {
    // 使用当前角色的提示词作为系统提示
    apiMessages.push({
      role: 'system',
      content: settingsStore.currentRole.prompt
    });
  }
  
  // 添加所有的用户和助手消息，但过滤掉空消息
  messages.value.forEach(msg => {
    if ((msg.role === 'user' && msg.content.trim()) || 
        (msg.role === 'assistant' && msg.content.trim())) {
      apiMessages.push({
        role: msg.role,
        content: msg.content
      });
    }
  });
  
  return apiMessages;
}

// 清除当前角色
const clearCurrentRole = () => {
  // 清除settings store中的角色设置
  settingsStore.currentRole = null;
  
  // 如果是历史记录，也需要更新历史记录中的角色数据
  if (historyStore.activeId !== 'current') {
    // 从历史记录中清除角色定义
    historyStore.updateRecord(historyStore.activeId, { roleData: null });
    console.log('[ChatView] 已从历史记录中清除角色定义');
  } else {
    // 清除当前会话的角色存储
    localStorage.removeItem('currentChatRole');
  }
  
  ElMessage.success('已清除当前角色设置');
}

// 修改自动保存当前聊天记录方法，使用saveMessages函数
const autoSaveCurrentChat = () => {
  saveMessages();
}

// 加载历史对话
// 处理当前聊天的操作

// 删除历史对话
// const handleDeleteChat = (chatId) => {
//   const indexToDelete = chatHistory.value.findIndex(chat => chat.id === chatId)
//   if (indexToDelete !== -1) {
//     const chatToDelete = chatHistory.value[indexToDelete]
//     ElMessage.success(`已删除对话: ${chatToDelete.title}`)
//     chatHistory.value.splice(indexToDelete, 1)
    
//     // 如果删除的是当前活跃的历史记录，则重置为current
//     if (activeHistoryId.value === chatId) {
//       activeHistoryId.value = 'current'
//       chatStore.clearMessages()
//       currentChatTitle.value = '新对话'
//     }
    
//     saveChatHistory()
//   }
// }
// 删除历史对话
const handleDeleteChat = (chatId) => {
  // 使用historyStore API删除记录
  historyStore.deleteRecord(chatId);
  ElMessage.success('已删除对话');
}
// 切换侧边栏函数
const toggleSidebar = () => {
  // 这个函数现在主要用于PC端的侧边栏折叠
  if (!isMobileView.value) {
    isSidebarOpen.value = !isSidebarOpen.value;
    showSettings.value = false; // 收起边栏时关闭设置面板
  } else {
    // 移动端调用新的toggleMobileSidebar
    toggleMobileSidebar();
  }
};

// 切换设置面板
const toggleSettings = () => {
  showSettings.value = !showSettings.value
  console.log('Settings dialog toggled:', showSettings.value)
}

// 保存设置
const saveSettings = () => {
  const customApiKey = settingsForm.value.apiKey;
  const customApiEndpoint = settingsForm.value.apiEndpoint;
  
  // 检查是否有自定义值
  const hasCustomValues = customApiKey || customApiEndpoint;
  
  // 验证API Key
  if (!customApiKey && !settingsStore.actualApiKey) {
    ElMessage.warning('API Key is required for the application to work');
    return;
  }
  
  // 保存所有设置到 store
  settingsStore.temperature = settingsForm.value.temperature;
  settingsStore.maxTokens = settingsForm.value.maxTokens;
  settingsStore.model = settingsForm.value.model;
  settingsStore.topP = settingsForm.value.topP;
  settingsStore.topK = settingsForm.value.topK;
  settingsStore.streamResponse = settingsForm.value.streamResponse;
  // 已移除 systemPrompt 的保存
  
  // 强制刷新模型选择器显示
  modelOptionsLastUpdated.value = Date.now();
  
  if (hasCustomValues) {
    // 用户提供了自定义值，启用自定义API
    settingsStore.setCustomAPI(customApiKey, customApiEndpoint);
    ElMessage.success('已保存自定义API设置');
  } else if (settingsStore.userCustomizedAPI) {
    // 用户清空了自定义值，回退到环境变量
    settingsStore.clearCustomAPI();
    ElMessage.success('已恢复使用环境变量API设置');
  } else {
    // 没有变化，只是保存其他设置
    ElMessage.success('设置已保存');
  }
  
  // 保存设置后关闭对话框
  showSettings.value = false;
}

const handleDarkModeChange = (value) => {
  settingsStore.isDarkMode = value
}

// 监听消息变化，自动保存
watch(messages, () => {
  saveMessages();
  
  nextTick(() => {
    if (messagesContainer.value) {
      // 检查是否在底部或接近底部，只有在底部时才自动滚动
      if (isScrolledToBottom()) {
        scrollToBottom();
      } else {
        // 如果不在底部，显示滚动到底部按钮
        showScrollButton.value = true;
      }
    }
  });
}, { deep: true });

// 在组件挂载时加载保存的消息
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  
  // 加载保存的聊天历史
  const savedHistory = localStorage.getItem('chatHistory');
  if (savedHistory) {
    try {
      chatHistory.value = JSON.parse(savedHistory);
    } catch (e) {
      console.error('加载聊天历史失败:', e);
      chatHistory.value = [];
    }
  }
  
  // 加载当前聊天
  const savedCurrentChat = localStorage.getItem('currentChat');
  if (savedCurrentChat) {
    try {
      const savedMessages = JSON.parse(savedCurrentChat);
      if (savedMessages.length > 0) {
        chatStore.setMessages(savedMessages);
        
        // 初始化当前会话状态
        currentSessionMessages.value = JSON.parse(JSON.stringify(savedMessages));
        
        // 设置当前会话标题
        updateCurrentSessionTitle(savedMessages);
      }
    } catch (e) {
      console.error('加载当前聊天失败:', e);
      
      // 初始化默认状态
      currentSessionMessages.value = [];
      currentSessionTitle.value = '新对话';
      currentChatTitle.value = '新对话';
    }
  } else {
    // 如果没有保存的当前聊天，初始化默认状态
    currentSessionMessages.value = [];
    currentSessionTitle.value = '新对话';
    currentChatTitle.value = '新对话';
  }
  
  // 初始化滚动状态
  nextTick(() => {
    if (messagesContainer.value) {
      scrollToBottom();
      handleScroll();
    }
  });
});

// Watch for changes in chatStore.messages to update currentSessionTitle and currentSessionMessages
// ONLY when the current chat is active.
watch(() => chatStore.messages, (newMessages) => {
  // Only save to localStorage if we're in the current session
  if (historyStore.isCurrentSession) {
    console.log('[ChatView] Current session changed, saving to localStorage');
    localStorage.setItem('currentChat', JSON.stringify(newMessages));
    
    // Update currentSessionMessages and title
    currentSessionMessages.value = JSON.parse(JSON.stringify(newMessages));
    updateCurrentSessionTitle(newMessages);
  } else {
    console.log('[ChatView] History record changed, not saving to localStorage');
  }
  
  // 处理滚动
  nextTick(() => {
    if (messagesContainer.value) {
      if (isScrolledToBottom()) {
        scrollToBottom();
      } else {
        showScrollButton.value = true;
      }
    }
  });
}, { deep: true });

// 更新当前会话标题的函数
const updateCurrentSessionTitle = (messages) => {
  if (!messages || messages.length === 0) {
    currentSessionTitle.value = '新对话';
    if (historyStore.isCurrentSession) {
      currentChatTitle.value = '新对话';
    }
    return;
  }
  
  // 使用第一条用户消息作为标题
  const firstUserMsg = messages.find(m => m.role === 'user');
  if (!firstUserMsg) {
    currentSessionTitle.value = '新对话';
    if (historyStore.isCurrentSession) {
      currentChatTitle.value = '新对话';
    }
    return;
  }
  
  // 创建标题
  const newTitle = firstUserMsg.content.length > 20 
    ? firstUserMsg.content.substring(0, 20) + '...' 
    : firstUserMsg.content;
    
  // 更新标题
  currentSessionTitle.value = newTitle;
  
  // 如果当前会话是激活的，同时也更新主聊天区域的标题
  if (historyStore.isCurrentSession) {
    currentChatTitle.value = newTitle;
  }
  
  console.log('更新当前会话标题:', newTitle);
}

// 移除保存按钮相关的函数，改为自动保存
// 保存当前对话 - 这个方法不再需要，但保留以便手动触发
const saveCurrentChat = () => {
  autoSaveCurrentChat();
}

// 获取模型显示名称
const getModelDisplayName = () => {
    // 强制模型选项刷新的依赖项
    const _ = modelOptionsLastUpdated.value;
    const model = settingsStore.model;
    const option = settingsStore.modelOptions.find(opt => opt.value === model);
    return option ? option.label : 'models';
}

// 为聊天项生成随机颜色
const getRandomColor = (id) => {
    const colors = [
        '#4284f5', '#06b6d4', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#ef4444'
    ];
    // 使用id作为种子，确保同一id总是得到相同的颜色
    const index = parseInt(id.toString().slice(-5)) % colors.length;
    return colors[index];
}

// 已移除重复函数

// 智能生成建议问题函数
const generateSuggestedQuestions = (message) => {
    console.log('[ChatView] 尝试生成建议问题');
    
    // 确保消息不为空且已完成
    if (!message || !message.content || !message.completed) {
        console.log('[ChatView] 消息未完成或内容为空，不生成建议问题');
        return;
    }
    
    const content = message.content;
    // 如果内容过短，不生成建议问题
    if (content.length < 50) {
        console.log('[ChatView] 消息内容过短，不生成建议问题');
        return;
    }
    
    // 在消息完成后增加延迟，确保流式输出完全结束
    console.log('[ChatView] 等待消息真正完成流式输出后再生成建议问题');
    
    // 清除之前的建议问题，防止在延迟期间显示
    message.suggestedQuestions = null;
    
    // 设置足够的延迟时间，确保在消息完全加载后再显示建议问题
    setTimeout(() => {
        console.log('[ChatView] 开始为已完成的消息生成建议问题');
        
        // 分析消息内容，提取关键主题
        const keywords = extractKeywords(content);
        console.log('[ChatView] 提取的关键词:', keywords);
        
        // 初始化问题数组
        let questions = [];
        
        // 如果提取的关键词太少，使用默认问题
        if (keywords.length < 2) {
            questions = [
                '能详细解释这个解决方案吗？',
                '有没有实际的应用案例？',
                '这种方法的优缺点是什么？'
            ];
        } else {
            // 添加深入探讨类问题
            if (keywords.length >= 1) {
                questions.push(`关于${keywords[0]}的深入原理是什么？`);
            }
            
            // 添加应用案例类问题
            if (keywords.length >= 2) {
                questions.push(`${keywords[1]}在实际项目中如何应用？`);
            }
            
            // 添加比较分析类问题
            if (keywords.length >= 2) {
                questions.push(`${keywords[0]}和${keywords[1]}有什么区别和联系？`);
            }
            
            // 根据内容判断是否是技术类问题
            if (content.includes('代码') || content.includes('编程') || content.includes('开发')) {
                questions.push('有没有代码示例或最佳实践？');
            }
            
            // 确保有足够的问题
            if (questions.length < 3) {
                questions.push('这种方法的优缺点是什么？');
                questions.push('有没有替代方案？');
            }
        }
        
        // 保存建议问题
        message.suggestedQuestions = questions;
        console.log('[ChatView] 生成了建议问题:', questions);
    }, 2000); // 设置更长的延迟时间(2秒)确保消息完全渲染
}

// 从内容中提取关键词
const extractKeywords = (content) => {
    const keywords = [];
    
    // 简单的关键词提取方法
    // 1. 提取引号中的内容
    const quotedMatches = content.match(/[""''""「」《》]([^""''""「」《》]{2,10})[""''""「」《》]/g);
    if (quotedMatches) {
        quotedMatches.forEach(match => {
            const cleaned = match.replace(/[""''""「」《》]/g, '');
            if (cleaned.length >= 2 && cleaned.length <= 10) {
                keywords.push(cleaned);
            }
        });
    }
    
    // 2. 尝试找出常见的术语格式
    const termMatches = content.match(/([a-zA-Z][a-zA-Z0-9]+([\s\-][a-zA-Z0-9]+)?)/g);
    if (termMatches) {
        termMatches.forEach(term => {
            if (term.length > 3 && !['this', 'that', 'these', 'those', 'when', 'what', 'where'].includes(term.toLowerCase())) {
                keywords.push(term);
            }
        });
    }
    
    // 3. 提取中文关键短语
    const chineseTerms = content.match(/[\u4e00-\u9fa5]{2,6}([\u4e00-\u9fa5]{1,2})?/g);
    if (chineseTerms) {
        chineseTerms.forEach(term => {
            if (term.length >= 2 && term.length <= 8 && !keywords.includes(term)) {
                keywords.push(term);
            }
        });
    }
    
    // 去重并限制数量
    return [...new Set(keywords)].slice(0, 5);
}

// 从内容中提取关键主题
const extractKeySubjects = (content) => {
    // 实现简单的主题提取逻辑
    const subjects = [];
    
    // 先尝试提取短语句或关键概念
    const paragraphs = content.split(/\n+/);
    for (const paragraph of paragraphs) {
        // 对中文，一般有引号、场景或关键主题的部分
        const quotedMatches = paragraph.match(/[\u300c\u300d\u201c\u201d《》]([^\u300c\u300d\u201c\u201d《》]{2,10})[\u300c\u300d\u201c\u201d《》]/g);
        if (quotedMatches) {
            quotedMatches.forEach(match => {
                const cleanMatch = match.replace(/[\u300c\u300d\u201c\u201d《》]/g, '');
                if (cleanMatch.length >= 2 && cleanMatch.length <= 10) {
                    subjects.push(cleanMatch);
                }
            });
        }
        
        // 提取以"是"、"就是"、"作为"结尾的短语
        const endingMatches = paragraph.match(/([\u4e00-\u9fa5\w]{2,10})(是|就是|作为)([\uff0c\uff1a\uff1b\u3002]|$)/g);
        if (endingMatches) {
            endingMatches.forEach(match => {
                const cleanMatch = match.replace(/(是|就是|作为)([\uff0c\uff1a\uff1b\u3002]|$)/g, '');
                if (cleanMatch.length >= 2 && cleanMatch.length <= 10) {
                    subjects.push(cleanMatch);
                }
            });
        }
    }
    
    // 如果还没有提取到足够的主题，尝试从段落首句提取
    if (subjects.length < 3) {
        for (const paragraph of paragraphs) {
            if (paragraph.length > 10) {
                const firstSentence = paragraph.split(/[\u3002\uff0c\uff1b\uff1a]/)[0];
                if (firstSentence && firstSentence.length >= 4 && firstSentence.length <= 15) {
                    subjects.push(firstSentence.substring(0, 10));
                }
            }
        }
    }
    
    // 去重
    return [...new Set(subjects)];
}

// 处理模型变更
const handleModelChange = (modelValue) => {
  // 设置新选择的模型
  settingsStore.model = modelValue;
  // 同步更新设置表单中的模型
  if (settingsForm.value) {
    settingsForm.value.model = modelValue;
  }
  // 刷新模型显示
  modelOptionsLastUpdated.value = Date.now();
  ElMessage.success(`模型已切换为: ${getModelDisplayName()}`);
}

// 添加模型解析功能
const parseModels = async () => {
    try {
        // 禁用提示按钮
        isParsingModels.value = true;
        
        // 使用表单中的值，优先使用表单值而不是store中的值
        const apiKey = settingsForm.value.apiKey || settingsStore.apiKey;
        const apiEndpoint = settingsForm.value.apiEndpoint || settingsStore.apiEndpoint;
        
        // 判断是否使用自定义API
        const isUsingCustomApi = !!(settingsForm.value.apiKey || settingsForm.value.apiEndpoint);
        
        console.log('解析模型 - 表单数据:', {
            apiKey: apiKey ? '已设置' : '未设置',
            apiEndpoint: apiEndpoint,
            isUsingCustomApi: isUsingCustomApi
        });
        
        // 先检查后端API是否可用
        const backendAvailable = await checkBackendAvailability();
        
        // 如果后端API不可用且没有API密钥，则提示设置API密钥
        if (!backendAvailable && !apiKey) {
            ElMessage.warning('请先设置API密钥或配置后端API');
            isParsingModels.value = false;
            return;
        }
        
        // 使用apiService中的getModelsList方法获取模型列表，传入userCustomizedAPI标志
        const response = await getModelsList(apiKey, apiEndpoint, isUsingCustomApi);
        
        if (!response || !response.data || !Array.isArray(response.data)) {
            throw new Error('获取模型列表失败：返回数据格式不正确');
        }
        
        // 提取模型ID列表
        const modelsList = response.data.map(model => model.id).sort();
        
        console.log('获取到的模型:', modelsList);
        
        if (modelsList.length > 0) {
            // 使用store的action添加新模型，传入true作为第二个参数以清除现有模型
            const addedCount = settingsStore.addModels(modelsList, true);
            
            // 更新本地表单中的模型列表
            modelOptionsLastUpdated.value = Date.now();
            
            // 如果当前选择的模型在新模型列表中不存在，则设置为第一个可用模型
            if (!modelsList.includes(settingsForm.value.model)) {
                settingsForm.value.model = modelsList[0];
            }
            
            ElMessage.success(`成功解析到 ${modelsList.length} 个模型，已更新模型列表`);
        } else {
            ElMessage.info('未解析到任何模型，请检查API接口是否正确');
        }
    } catch (error) {
        console.error('解析模型失败:', error);
        ElMessage.error(`解析模型失败: ${error.message || '未知错误'}`);
    } finally {
        // 启用提示按钮
        isParsingModels.value = false;
    }
}

// 处理暗黑模式切换
const toggleDarkMode = () => {
  settingsStore.toggleDarkMode();
};

// 格式化时间戳
const formatTimestamp = () => {
  const now = new Date();
  return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
}

// 处理滚动到底部按钮的显示
const showScrollButton = ref(false);
const scrollTimeout = ref(null);

// 判断是否滚动到底部
const isScrolledToBottom = () => {
  if (!messagesContainer.value) return true;
  
  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value;
  // 更新距离底部的容差值为250px，与上面滚动跟随阈值保持一致
  const tolerance = 250;
  return scrollHeight - scrollTop - clientHeight <= tolerance;
};

// 处理滚动事件
const handleScroll = () => {
  if (!messagesContainer.value) return;
  
  // 清除之前的定时器
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value);
  }
  
  // 判断是否已经滚动到底部
  const atBottom = isScrolledToBottom();
  
  // 如果没有在底部，显示按钮
  if (!atBottom) {
    showScrollButton.value = true;
  } else {
    showScrollButton.value = false;
  }
  
  // 设置定时器，如果在1秒内没有继续滚动则检查是否在底部
  scrollTimeout.value = setTimeout(() => {
    // 延迟后再次检查是否在底部
    if (isScrolledToBottom()) {
      showScrollButton.value = false;
    }
  }, 1000);
};

// 处理消息更新
const handleMessageUpdate = (updatedMessage) => {
  const index = chatStore.messages.findIndex(m => m.id === updatedMessage.id);
  if (index !== -1) {
    chatStore.messages[index].content = updatedMessage.content;
    saveMessages();
  }
};

// 处理消息删除
const handleMessageDelete = (message) => {
  const index = chatStore.messages.findIndex(m => m.id === message.id);
  if (index !== -1) {
    // 移除消息
    chatStore.messages.splice(index, 1);
    saveMessages();
  }
};


// 处理重新生成AI响应
const handleRegenerate = async (message) => {
  console.log('[ChatView] 开始重新生成，消息ID:', message.id);
  
  if (chatStore.isLoading) {
    ElMessage.warning('已有消息正在处理中，请稍后再试');
    return;
  }
  
  // 重置暂停状态
  isStreamPaused.value = false;
  console.log('[ChatView] 开始重新生成，消息ID:', message.id);

  try {
    // 1. 找到原始AI消息在消息列表中的索引
    const originalMessages = [...chatStore.messages];
    // 不再需要+1，因为我们已经修复了ID生成，每个消息都有唯一的ID
    // 如果仍然需要添加+1，应该是因为消息结构或索引逻辑存在其他问题
    const aiIndex = originalMessages.findIndex(m => m.id === message.id && m.role === 'assistant');
    console.log('[ChatView] 当前index:', aiIndex);
    console.log('[ChatView] 全部消息:', originalMessages);//打印实际消息数组结构
    if (aiIndex === -1) {
    ElMessage.warning('找不到要重新生成的消息');
    return;
  }
  
    // 检查是否是AI消息
    if (originalMessages[aiIndex].role !== 'assistant') {
      ElMessage.warning('只能重新生成AI消息');
      return;
    }
    
    // 2. 查找相关的用户消息（AI消息前的第一条用户消息）
    let userIndex = -1;
    for (let i = aiIndex - 1; i >= 0; i--) {
      if (originalMessages[i].role === 'user') {
        userIndex = i;
      break;
    }
  }
  
    if (userIndex === -1) {
      ElMessage.warning('找不到相关的用户消息');
    return;
  }
  
    // 3. 创建API请求所需的消息列表
    let apiMessages = [];
  
    // 添加系统提示词
    if (settingsStore.currentRole?.prompt) {
      apiMessages.push({
        role: 'system',
        content: settingsStore.currentRole.prompt
      });
    }
    
    // 添加上下文消息（用户消息之前的所有消息，最多4条）
    const MAX_CONTEXT = 4;
    const contextStartIndex = Math.max(0, userIndex - MAX_CONTEXT);
    for (let i = contextStartIndex; i < userIndex; i++) {
      apiMessages.push({
        role: originalMessages[i].role,
        content: originalMessages[i].content
      });
    }
    
    // 添加用户消息
    apiMessages.push({
      role: 'user',
      content: originalMessages[userIndex].content
    });
    
    console.log(`[ChatView] 重新生成 - 准备使用${apiMessages.length}条消息`);
    
    // 4. 创建新的AI消息作为占位
    const newAssistantMessage = {
      id: Date.now() + Math.floor(Math.random() * 1000), // 使用时间戳+随机数确保唯一性
      role: 'assistant',
      content: '',
      reasoningContent: '',
      timestamp: new Date().toISOString(),
      startTimestamp: Date.now(), // 记录开始时间戳
      firstResponseTime: null, // 首次数据包接收时间，用于计算网络请求延迟（从发送到首包）
      completed: false,
      loading: true,
      messageStreamFinished: false // 新增，初始化为 false
    };
    
    // 5. 构建新的消息数组，替换旧的AI消息
    const newMessages = [...originalMessages];
    newMessages.splice(aiIndex, 1, newAssistantMessage); // 替换而不是删除
    chatStore.messages = newMessages;
    
    // 6. 滚动到底部
    await nextTick();
    scrollToBottom(true);
    
    // 7. 发送API请求
    chatStore.isLoading = true;
    
    // 认证选项
    const authOptions = {
      apiKey: settingsStore.actualApiKey,
      apiEndpoint: settingsStore.actualApiEndpoint,
      userCustomizedAPI: settingsStore.userCustomizedAPI
    };
    
    const result = await messageHandler.sendMessageViaBackend(
      apiMessages,
      {
        model: settingsStore.model,
        temperature: settingsStore.temperature,
        max_tokens: settingsStore.maxTokens,
        stream: settingsStore.streamResponse
      },
      (updatedContent, done) => {
        // 检查是否暂停
        if (isStreamPaused.value) return;
        
        // 找到新AI消息并更新内容
        const newMsgIndex = chatStore.messages.findIndex(m => m.id === newAssistantMessage.id);
        if (newMsgIndex === -1) return;
        
        const msgToUpdate = chatStore.messages[newMsgIndex];
        
        // 首次接收到内容时记录时间
        if (msgToUpdate.loading && !msgToUpdate.firstResponseTime) {
          msgToUpdate.firstResponseTime = Date.now();
          console.log(`[ChatView] 重新生成 - 首个数据包接收时间: ${msgToUpdate.firstResponseTime - msgToUpdate.startTimestamp}ms`);
          }
          
        // 更新消息内容
          if (typeof updatedContent === 'object') {
            if (updatedContent.content !== undefined) {
            msgToUpdate.content = updatedContent.content;
            }
            if (updatedContent.reasoningContent !== undefined) {
            if (!msgToUpdate.reasoningContent) {
              msgToUpdate.reasoningContent = '';
              }
            msgToUpdate.reasoningContent = updatedContent.reasoningContent;
            }
          } else if (updatedContent && updatedContent.length > 0) {
          msgToUpdate.content = updatedContent;
          }
          
        // 移除loading状态
        if (msgToUpdate.loading) {
          msgToUpdate.loading = false;
        }
        
        // 自动滚动
        if (isScrolledToBottom()) {
            nextTick(() => scrollToBottom(true));
        }
        
        // 处理完成
        if (done) {
          msgToUpdate.completed = true;
          
          // 计算响应时间
          if (msgToUpdate.startTimestamp) {
            const endTime = Date.now();
            msgToUpdate.responseTime = endTime - msgToUpdate.startTimestamp;
          }
          
          // 更新token计数
            const promptTokens = messageHandler.countTokens(apiMessages.filter(m => m.role !== 'assistant').map(m => m.content).join(''));
            const completionTokens = messageHandler.countTokens(typeof updatedContent === 'object' ? updatedContent.content || '' : updatedContent || '');
          
          // 保存token数量到消息对象中，便于UI显示
          msgToUpdate.tokenCount = completionTokens;
          
          // 更新全局token计数
            chatStore.updateTokenCount(promptTokens, completionTokens);
          
          // 保存消息
            saveMessages();
          
          console.log(`[ChatView] 消息生成完成，Prompt Tokens: ${promptTokens}, Completion Tokens: ${completionTokens}, 总计: ${promptTokens + completionTokens}, 响应时间: ${msgToUpdate.responseTime}ms`);
        }
      },
      true, // 是重新生成操作
      authOptions
    );
    
    // 保存controller以便可能的中断
    if (result?.controller) {
      activeController.value = result.controller;
    }
  } catch (error) {
    console.error('[ChatView] 重新生成失败:', error);
    ElMessage.error('重新生成失败: ' + (error.message || '未知错误'));
  } finally {
      chatStore.isLoading = false;
      activeController.value = null;
  }
};

// 清空聊天记录
const handleClear = () => {
  // Confirmation is now handled in ChatInput.vue
  chatStore.clearMessages();
  currentChatTitle.value = '新对话';
  ElMessage.success('聊天记录已清空');
};

// 控制是否显示返回顶部按钮
const showScrollToTopButton = ref(false)

// 处理消息容器滚动事件
const handleMessagesScroll = () => {
  if (!messagesContainer.value) return
  
  // 当滚动距离超过500px时显示返回顶部按钮
  showScrollToTopButton.value = messagesContainer.value.scrollTop > 500
}

// 返回顶部
const scrollToTop = () => {
  if (!messagesContainer.value) return
  
  messagesContainer.value.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 判断是否是最后一条AI消息
// 判断是否是最后一条AI消息
const isLatestAIMessage = (message) => {
  // 过滤出所有AI消息
  const assistantMessages = chatStore.messages.filter(msg => msg.role === 'assistant');
  
  // 如果没有AI消息或者当前消息不是AI消息，返回false
  if (assistantMessages.length === 0 || message.role !== 'assistant') {
    return false;
  }
  
  // 判断当前消息是否是最后一条AI消息
  const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
  return message.id === lastAssistantMessage.id;
}

// 处理当前聊天的操作
const handleCurrentChatAction = (command) => {
  switch (command) {
    case 'export':
      // 导出当前聊天记录
      if (chatStore.messages.length === 0) {
        ElMessage.warning('没有可导出的对话内容');
        return;
      }
      const currentChat = {
  id: 'current',
  title: currentChatTitle.value,
  messages: JSON.parse(JSON.stringify(chatStore.messages)),
  roleData: settingsStore.currentRole ? {
    name: settingsStore.currentRole.name,
    prompt: settingsStore.currentRole.prompt
  } : null
};
exportChat(currentChat);
      break;
    case 'clear':
      // 确认是否清空当前聊天
      ElMessageBox.confirm(
        '确定要清空当前对话吗？',
        '清空确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        chatStore.clearMessages();
        currentSessionTitle.value = '新对话';
        currentChatTitle.value = '新对话';
        ElMessage.success('已清空当前对话');
      }).catch(() => {
        // 用户取消操作，不执行任何动作
      });
      break;
    default:
      console.log('未知命令:', command);
  }
};

// 导出聊天记录功能
const exportChat = (chat) => {
  // 检查参数是否合法
  if (!chat || !chat.messages || !Array.isArray(chat.messages) || chat.messages.length === 0) {
    ElMessage.warning('无法导出：聊天记录为空或格式不正确');
    console.error('Export failed, invalid chat object:', chat);
    return;
  }

  // 提供格式选择 - 使用更友好的选择框
  ElMessageBox({
    title: '📄导出对话',
    message: h('div', { class: 'export-format-selector' }, [
      h('p', { class: 'format-title' }, '选择导出格式:'),
      h('div', { class: 'format-options' }, [
        h('div', { 
          class: 'format-option', 
          onClick: () => selectExportFormat(chat, '1'),
        }, [
          h('div', { class: 'format-icon txt-icon' }, 'TXT'),
          h('div', { class: 'format-label' }, '纯文本'),
          h('div', { class: 'format-desc' }, '简单文本格式，适合任何设备查看')
        ]),
        h('div', { 
          class: 'format-option', 
          onClick: () => selectExportFormat(chat, '2'),
        }, [
          h('div', { class: 'format-icon html-icon' }, 'HTML'),
          h('div', { class: 'format-label' }, '网页样式'),
          h('div', { class: 'format-desc' }, '美观的网页格式，适合分享和打印')
        ]),
        h('div', { 
          class: 'format-option', 
          onClick: () => selectExportFormat(chat, '3'),
        }, [
          h('div', { class: 'format-icon md-icon' }, 'MD'),
          h('div', { class: 'format-label' }, 'Markdown'),
          h('div', { class: 'format-desc' }, '标记语言格式，适合编辑和转换')
        ]),
        h('div', { 
          class: 'format-option', 
          onClick: () => selectExportFormat(chat, '4'),
        }, [
          h('div', { class: 'format-icon json-icon' }, 'JSON'),
          h('div', { class: 'format-label' }, 'JSON数据'),
          h('div', { class: 'format-desc' }, '完整数据格式，适合开发和导入')
        ])
      ])
    ]),
    showCancelButton: true,
    confirmButtonText: '取消',
    cancelButtonText: '关闭',
    showConfirmButton: false,
    customClass: 'export-format-dialog'
  }).catch(() => {
    // 用户取消导出
  });
};

// 根据选择的格式处理导出
const selectExportFormat = (chat, format) => {
  let exportContent = '';
  const dateStr = new Date().toLocaleString();
  const messages = chat.messages;
  const rolePrompt = chat.roleData?.prompt || '';

  switch(format) {
    case '1': // TXT 格式
      exportContent = `╭───────────────────────────────╮\n│      AI 助手对话记录         │\n│ 导出时间: ${dateStr.padEnd(19)} │\n╰───────────────────────────────╯\n\n`;
      
      // 添加角色设置
      if (rolePrompt) {
        exportContent += `╭── 💡 角色设置 ──\n│\n│ ${rolePrompt.split('\n').join('\n│ ')}\n╰────────────────────────────────\n\n`;
      }
      
      // 添加消息内容
      messages.forEach(msg => {
        const role = msg.role === 'user' ? '👤 用户' : '🤖 AI';
        const time = msg.timestamp ? new Date(msg.timestamp).toLocaleString() : '未知时间';

        exportContent += `\n╭── ${role} · ${time} ──\n│\n`;

        // 优先显示思考内容
        if (msg.reasoningContent) {
          exportContent += `│ 💭 思考过程:\n│ ${msg.reasoningContent.split('\n').join('\n│ ')}\n│\n`;
        }

        exportContent += `│ 📝 内容:\n│ ${msg.content.split('\n').join('\n│ ')}\n╰────────────────────────────────\n`;
      });
      break;

    case '2': // HTML 格式
      exportContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 对话记录 - ${dateStr}</title>
  <style>
    :root {
      --primary-color: #4284f5;
      --primary-gradient: linear-gradient(135deg, #4284f5, #42a5f5);
      --secondary-color: #f5f7fa;
      --reasoning-color: #f39c12;
      --user-gradient: linear-gradient(135deg, #e74c3c, #f39c12, #2c7a65);
      --ai-gradient: linear-gradient(135deg, #4284f5, #0097a7);
      --card-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      --border-radius: 12px;
    }

    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      line-height: 1.8;
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
      background: var(--secondary-color);
      color: #333;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
      padding: 2.5rem;
      background: var(--primary-gradient);
      color: white;
      border-radius: var(--border-radius);
      box-shadow: var(--card-shadow);
      position: relative;
      overflow: hidden;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
      transform: rotate(30deg);
      z-index: 1;
    }
    
    .header h1 {
      position: relative;
      z-index: 2;
      margin-bottom: 1rem;
      font-size: 2.5rem;
    }
    
    .header p {
      position: relative;
      z-index: 2;
      opacity: 0.9;
    }

    .role-section {
      margin-bottom: 2.5rem;
      padding: 1.8rem;
      background: rgba(66, 132, 245, 0.1);
      border-radius: var(--border-radius);
      border-left: 5px solid var(--primary-color);
      box-shadow: 0 4px 15px rgba(66, 132, 245, 0.1);
    }
    
    .role-section h2 {
      margin-top: 0;
      color: var(--primary-color);
      font-size: 1.5rem;
      border-bottom: 1px solid rgba(66, 132, 245, 0.2);
      padding-bottom: 10px;
    }

    .messages-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .message {
      margin-bottom: 1rem;
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s ease;
    }
    
    .message:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
    }

    .user-message .message-header {
      background: var(--user-gradient);
    }
    
    .ai-message .message-header {
      background: var(--ai-gradient);
    }

    .message-header {
      padding: 1rem 1.5rem;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
    }

    .reasoning-section {
      padding: 1.2rem 1.5rem;
      background: rgba(243, 156, 18, 0.1);
      border-left: 4px solid var(--reasoning-color);
      margin: 1rem 1.5rem;
      border-radius: 8px;
    }
    
    .reasoning-section h3 {
      margin-top: 0;
      color: var(--reasoning-color);
      font-size: 1.1rem;
    }

    .content-section {
      padding: 1.5rem;
      background: white;
    }
    
    .content-section h3 {
      margin-top: 0;
      color: #444;
      font-size: 1.1rem;
      border-bottom: 1px solid #eee;
      padding-bottom: 8px;
    }

    .timestamp {
      font-size: 0.9em;
      opacity: 0.8;
    }

    pre {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1rem 0;
      border-left: 3px solid #ddd;
    }

    code {
      font-family: 'Fira Code', 'Consolas', monospace;
      font-size: 0.9em;
    }
    
    p code {
      background: rgba(0,0,0,0.05);
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 0.9em;
    }
    
    .footer {
      text-align: center;
      margin-top: 3rem;
      padding: 1rem;
      color: #888;
      font-size: 0.9rem;
      border-top: 1px solid #eee;
    }
    
    @media (max-width: 768px) {
      body {
        padding: 1rem;
      }
      
      .header {
        padding: 1.5rem;
      }
      
      .message-header, .content-section, .reasoning-section {
        padding: 1rem;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>AI 对话记录</h1>
    <p>导出时间: ${dateStr}</p>
  </div>`;

      // 添加角色设置
      if (rolePrompt) {
        exportContent += `
  <div class="role-section">
    <h2>💡 角色设置</h2>
    <div>${rolePrompt.replace(/\n/g, '<br>')}</div>
  </div>`;
      }

      exportContent += `
  <div class="messages-container">`;

      // 添加消息内容
      messages.forEach(msg => {
        const role = msg.role === 'user' ? '用户' : 'AI助手';
        const messageClass = msg.role === 'user' ? 'user-message' : 'ai-message';
        const time = msg.timestamp ? new Date(msg.timestamp).toLocaleString() : '未知时间';

        exportContent += `
    <div class="message ${messageClass}">
      <div class="message-header">
        <span>${role}</span>
        <span class="timestamp">${time}</span>
      </div>`;

        if (msg.reasoningContent) {
          exportContent += `
      <div class="reasoning-section">
        <h3>💭 思考过程</h3>
        <div>${msg.reasoningContent.replace(/\n/g, '<br>')}</div>
      </div>`;
        }

        exportContent += `
      <div class="content-section">
        <h3>📝 内容</h3>
        <div>${msg.content.split('\n').join('<br>')
          .replace(/```([a-z]*)([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
          .replace(/`([^`]+)`/g, '<code>$1</code>')}</div>
      </div>
    </div>`;
      });

      exportContent += `
  </div>
  
  <div class="footer">
    由 MyChat AI 助手生成 - ${new Date().getFullYear()}
  </div>
</body>
</html>`;
      break;

    case '2': // HTML 格式
      exportContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 对话记录 - ${dateStr}</title>
  <style>
    :root {
      --primary-color: #4284f5;
      --primary-gradient: linear-gradient(135deg, #4284f5, #42a5f5);
      --secondary-color: #f5f7fa;
      --reasoning-color: #f39c12;
      --user-gradient: linear-gradient(135deg, #e74c3c, #f39c12, #2c7a65);
      --ai-gradient: linear-gradient(135deg, #4284f5, #0097a7);
      --card-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      --border-radius: 12px;
    }

    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      line-height: 1.8;
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
      background: var(--secondary-color);
      color: #333;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
      padding: 2.5rem;
      background: var(--primary-gradient);
      color: white;
      border-radius: var(--border-radius);
      box-shadow: var(--card-shadow);
      position: relative;
      overflow: hidden;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
      transform: rotate(30deg);
      z-index: 1;
    }
    
    .header h1 {
      position: relative;
      z-index: 2;
      margin-bottom: 1rem;
      font-size: 2.5rem;
    }
    
    .header p {
      position: relative;
      z-index: 2;
      opacity: 0.9;
    }

    .role-section {
      margin-bottom: 2.5rem;
      padding: 1.8rem;
      background: rgba(66, 132, 245, 0.1);
      border-radius: var(--border-radius);
      border-left: 5px solid var(--primary-color);
      box-shadow: 0 4px 15px rgba(66, 132, 245, 0.1);
    }
    
    .role-section h2 {
      margin-top: 0;
      color: var(--primary-color);
      font-size: 1.5rem;
      border-bottom: 1px solid rgba(66, 132, 245, 0.2);
      padding-bottom: 10px;
    }

    .messages-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .message {
      margin-bottom: 1rem;
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s ease;
    }
    
    .message:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
    }

    .user-message .message-header {
      background: var(--user-gradient);
    }
    
    .ai-message .message-header {
      background: var(--ai-gradient);
    }

    .message-header {
      padding: 1rem 1.5rem;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
    }

    .reasoning-section {
      padding: 1.2rem 1.5rem;
      background: rgba(243, 156, 18, 0.1);
      border-left: 4px solid var(--reasoning-color);
      margin: 1rem 1.5rem;
      border-radius: 8px;
    }
    
    .reasoning-section h3 {
      margin-top: 0;
      color: var(--reasoning-color);
      font-size: 1.1rem;
    }

    .content-section {
      padding: 1.5rem;
      background: white;
    }
    
    .content-section h3 {
      margin-top: 0;
      color: #444;
      font-size: 1.1rem;
      border-bottom: 1px solid #eee;
      padding-bottom: 8px;
    }

    .timestamp {
      font-size: 0.9em;
      opacity: 0.8;
    }

    pre {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1rem 0;
      border-left: 3px solid #ddd;
    }

    code {
      font-family: 'Fira Code', 'Consolas', monospace;
      font-size: 0.9em;
    }
    
    p code {
      background: rgba(0,0,0,0.05);
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 0.9em;
    }
    
    .footer {
      text-align: center;
      margin-top: 3rem;
      padding: 1rem;
      color: #888;
      font-size: 0.9rem;
      border-top: 1px solid #eee;
    }
    
    @media (max-width: 768px) {
      body {
        padding: 1rem;
      }
      
      .header {
        padding: 1.5rem;
      }
      
      .message-header, .content-section, .reasoning-section {
        padding: 1rem;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>AI 对话记录</h1>
    <p>导出时间: ${dateStr}</p>
  </div>`;

      // 添加角色设置
      if (rolePrompt) {
        exportContent += `
  <div class="role-section">
    <h2>💡 角色设置</h2>
    <div>${rolePrompt.replace(/\n/g, '<br>')}</div>
  </div>`;
      }

      exportContent += `
  <div class="messages-container">`;

      // 添加消息内容
      messages.forEach(msg => {
        const role = msg.role === 'user' ? '用户' : 'AI助手';
        const messageClass = msg.role === 'user' ? 'user-message' : 'ai-message';
        const time = msg.timestamp ? new Date(msg.timestamp).toLocaleString() : '未知时间';

        exportContent += `
    <div class="message ${messageClass}">
      <div class="message-header">
        <span>${role}</span>
        <span class="timestamp">${time}</span>
      </div>`;

        if (msg.reasoningContent) {
          exportContent += `
      <div class="reasoning-section">
        <h3>💭 思考过程</h3>
        <div>${msg.reasoningContent.replace(/\n/g, '<br>')}</div>
      </div>`;
        }

        exportContent += `
      <div class="content-section">
        <h3>📝 内容</h3>
        <div>${msg.content.split('\n').join('<br>')
          .replace(/```([a-z]*)([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
          .replace(/`([^`]+)`/g, '<code>$1</code>')}</div>
      </div>
    </div>`;
      });

      exportContent += `
  </div>
  
  <div class="footer">
    由 MyChat AI 助手生成 - ${new Date().getFullYear()}
  </div>
</body>
</html>`;
      break;

    case '3': // Markdown 格式
      exportContent = `# AI 对话记录 📝

**📅 导出时间**: ${dateStr}

`;
      
      // 添加角色设置
      if (rolePrompt) {
        exportContent += `## 💡 角色设置

${rolePrompt}

---

`;
      }
      
      // 添加消息内容
      messages.forEach(msg => {
        const role = msg.role === 'user' ? '👤 **用户**' : '🤖 **AI助手**';
        const time = msg.timestamp ? new Date(msg.timestamp).toLocaleString() : '未知时间';
        const emoji = msg.role === 'user' ? '💬' : '🔍';

        exportContent += `## ${emoji} ${role} · *${time}*\n\n`;

        if (msg.reasoningContent) {
          exportContent += `### 💭 思考过程\n\`\`\`\n${msg.reasoningContent}\n\`\`\`\n\n`;
        }

        exportContent += `### 📝 内容\n${msg.content}\n\n---\n\n`;
      });
      
      // Add footer
      exportContent += `\n\n*由 MyChat AI 助手生成 - ${new Date().getFullYear()}*`;
      break;

    case '4': // JSON 格式
      // 构建JSON格式的导出内容，包括角色设置
      const exportData = {
        meta: {
          title: "AI 对话记录",
          exportDate: dateStr,
          version: "2.0"
        },
        settings: {
          role: chat.roleData || null
        },
        messages: messages.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          reasoningContent: msg.reasoningContent || "",
          timestamp: msg.timestamp,
          hasReasoning: !!msg.reasoningContent
        }))
      };
      
      exportContent = JSON.stringify(exportData, null, 2);
      break;

    default:
      ElMessage.warning('无效的选择');
      return;
  }

  // 确定文件扩展名
  const ext =
    format === '1' ? 'txt' :
    format === '2' ? 'html' :
    format === '3' ? 'md' : 'json';

  // 创建下载链接
  const blob = new Blob([exportContent], {
    type: format === '2' ? 'text/html' :
          format === '4' ? 'application/json' : 'text/plain;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AI对话记录_${new Date().toISOString().slice(0, 10)}.${ext}`;
  document.body.appendChild(a);
  a.click();

  // 清理
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
  
  ElMessage.success('对话已导出');
}

// Migration function to convert old chat history format to new format
const migrateOldChatHistory = () => {
  // Check if there's old chat history data to migrate
  const savedHistory = localStorage.getItem('chatHistory');
  if (!savedHistory) return;
  
  try {
    const oldChatHistory = JSON.parse(savedHistory);
    if (!Array.isArray(oldChatHistory) || oldChatHistory.length === 0) return;
    
    console.log(`Migrating ${oldChatHistory.length} old chat history records to new format...`);
    
    // Migrate each old chat history to the new format
    oldChatHistory.forEach(oldChat => {
      if (!oldChat.id || !oldChat.messages) return;
      
      // Create a new history record in the new format
      const record = {
        id: oldChat.id,
        title: oldChat.title || 'Untitled Chat',
        messages: JSON.parse(JSON.stringify(oldChat.messages)),
        timestamp: oldChat.createdAt || new Date().toISOString(),
        tokenCount: { prompt: 0, completion: 0, total: 0 } // Default token count
      };
      
      // Add the record if it doesn't already exist
      if (!historyStore.hasRecord(record.id)) {
        historyStore.addRecord(record);
      }
    });
    
    console.log('Migration complete. Removing old chat history data.');
    
    // Remove old data after successful migration
    localStorage.removeItem('chatHistory');
  } catch (error) {
    console.error('Error migrating old chat history:', error);
  }
};

// Add this after the Model selection dropdown but before the Temperature slider


// Add these variables to the script setup section
// Add this near where settingsForm is declared
const customModelInput = ref('');
const customModels = ref([]);

// Add this function to handle adding custom models
const addCustomModel = () => {
    if (customModelInput.value.trim()) {
        const newModel = {
            label: customModelInput.value.trim(),
            value: customModelInput.value.trim()
        };
        
        // Check if the model already exists
        const modelExists = modelOptions.value.some(model => 
            model.value === newModel.value
        );
        
        if (!modelExists) {
            // Add to settings store
            settingsStore.addModels([newModel.value]);
            customModels.value.push(newModel);
            ElMessage.success(`Added custom model: ${newModel.label}`);
            
            // Update local form if needed
            modelOptionsLastUpdated.value = Date.now();
            
            // Clear input field
            customModelInput.value = '';
        } else {
            ElMessage.warning('This model already exists in the list');
        }
    }
};

// Add this function to handle removing custom models
const removeCustomModel = (index) => {
    const modelToRemove = customModels.value[index];
    
    // First confirm with the user
    ElMessageBox.confirm(
        `Are you sure you want to remove the custom model "${modelToRemove.label}"?`,
        'Confirm Removal',
        {
            confirmButtonText: 'Yes, Remove',
            cancelButtonText: 'Cancel',
            type: 'warning'
        }
    ).then(() => {
        // Remove from the local list
        customModels.value.splice(index, 1);
        
        // We can't easily remove from the store's modelOptions,
        // but we can update the UI by forcing a refresh
        modelOptionsLastUpdated.value = Date.now();
        
        ElMessage.success(`Removed custom model: ${modelToRemove.label}`);
    }).catch(() => {
        // User cancelled, do nothing
    });
};

// Add CSS for the custom model input section
// Inside <style> section, add:

// 在组件初始化时重置状态
onMounted(() => {
  // 初始化状态
  isStreamPaused.value = false;
  activeController.value = null;
  chatStore.isLoading = false;
  
  // 无需手动加载消息，historyStore会自动加载
  console.log('[ChatView] Component mounted, states reset');
});

// 在组件卸载时清理状态
onUnmounted(() => {
  // 如果有活跃的请求，中止它
  if (activeController.value) {
    activeController.value.abort();
    activeController.value = null;
  }
  
  // 重置状态
  isStreamPaused.value = false;
  chatStore.isLoading = false;
});

</script>

<style lang="scss" scoped>
/* 整体容器结构 */
.chat-view-container {
    display: flex;
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden;
    font-family: var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial);
    background-color: var(--bg-color, #f3f4f6);
    
    /* 移动端优化阅读字体 */
    @media (max-width: 768px) {
        font-family: "Microsoft YaHei", "PingFang SC", "Heiti SC", "Noto Sans SC", -apple-system, BlinkMacSystemFont, sans-serif;
        font-weight: 400;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        letter-spacing: 0.015em;
    }
    
    &.sidebar-collapsed {
        .icon-sidebar {
            // 保持原样
        }
        
        .sidebar {
            width: 0;
            padding: 0;
            overflow: hidden;
        }
        
        .main-chat-area {
            width: calc(100% - 52px); // 只减去图标栏的宽度
        }
    }
}

// 移动端侧边栏遮罩
.mobile-sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 190; // 低于侧边栏，高于其他内容
    display: none;
    
    &.active {
        display: block; // 激活时显示
        animation: fadeIn 0.3s ease;
    }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* 主聊天区域样式 */
.main-chat-area {
    flex-grow: 1;
    width: calc(100% - 332px); // 总宽度减去侧边栏(280px)和图标栏(52px)
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    transition: width 0.3s ease;
    
    @media (max-width: 768px) {
        width: 100%; // 移动端占满全屏
        height: 100vh; // 明确设置高度
        margin-left: 0; // 移除左边距，确保全屏显示
    }
    
    /* 添加滚动到底部按钮 - 移到main-chat-area内部 */
    .scroll-to-bottom-btn {
        position: fixed;
        bottom: 175px;
        left: 60%;
        transform: translateX(-50%);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: transparent;
        color: black;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: none;
        border: none;
        outline: none;
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 100;
        pointer-events: auto;
        
        /* 考虑侧边栏状态 */
        .sidebar-collapsed & {
            left: calc(52px + (100% - 52px) / 2); /* 图标栏宽度 + 剩余区域的一半 */
        }
        
        &.visible {
            opacity: 1;
            visibility: visible;
            //animation: bounce 1s ease infinite;
        }
        
        &:hover {
            color: rgba(0, 0, 0, 0.8);
            transform: translateX(-50%) translateY(-2px);
        }
        
        &:active {
            transform: translateX(-50%) translateY(0);
        }
        
        svg {
            width: 24px;
            height: 24px;
            filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.2));
        }
        
        @media (max-width: 768px) {
            bottom: 100px;
            right: 16px;
            left: auto;
            transform: none;
            width: 36px;
            height: 36px;
            
            &:hover {
                transform: translateY(-2px);
            }
            
            &:active {
                transform: translateY(0);
            }
            
            svg {
                width: 22px;
                height: 22px;
            }
        }
    }
}

/* 聊天内容区域 */
.chat-content {
    flex-grow: 1;
    height: calc(100% - 135px); // 留出头部和输入区域的空间
    overflow-y: auto;
    padding: 1.5rem;
    position: relative;
    display: flex;
    flex-direction: column;
    
    // 自定义滚动条
    &::-webkit-scrollbar {
        width: 1px;
        height: 1px;
    }
    scrollbar-width: auto;
    
    &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
    }
    
    &:hover::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.3);
    }
    
    @media (max-width: 768px) {
        padding: 1rem 0.75rem; // 移动端减小内边距，增加可用宽度
        height: calc(100% - 120px); // 调整移动端高度
    }
}

/* 聊天消息区域 */
.message-list {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    max-width: 900px; // 限制最大宽度，保持可读性
    margin: 0 auto; // 居中显示
    width: 100%; // 占满可用空间
    
    @media (max-width: 768px) {
        max-width: 100%; // 移动端占满宽度
        margin: 0; // 移除边距，充分利用空间
    }
}

// 聊天输入区域
.modern-chat-input {
    padding: 0.75rem 1.5rem 1.5rem;
    position: relative;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
    
    @media (max-width: 768px) {
        padding: 0.5rem 0.75rem 1rem; // 减小内边距
        max-width: 100%; // 移动端占满宽度
    }
}

/* 垂直图标栏 */
.icon-sidebar {
    width: 60px;
    background-color: #202123;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
    // 移动端隐藏图标栏，后续可通过按钮控制显示
    @media (max-width: 768px) {
        display: none; 
    }
    
    .icon-item {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #888;
        margin-bottom: 16px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
            background-color: #2d2d33;
            color: #fff;
        }
        
        &.main-icon {
            margin-bottom: 24px;
        }
        
        &.bottom-icon {
            margin-top: auto;
            margin-bottom: 0;
        }
        
        &.dark-mode-toggle {
            background-color: #2a2a30;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
            
            .toggle-icon-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            }
            
            .moon-icon, .sun-icon {
                filter: drop-shadow(0 0 2px rgba(255, 212, 59, 0.6));
            }
            
            &:hover {
                transform: scale(1.1);
                box-shadow: 0 0 8px rgba(255, 212, 59, 0.5);
            }
            
            &:after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle, rgba(255,212,59,0.2) 0%, rgba(255,212,59,0) 70%);
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            &:hover:after {
                opacity: 1;
            }
            
            // Styles specific to dark mode active state
            &.dark-mode-active {
                background-color: #363640;
            }
        }
        
        .blue-avatar {
            background-color: white;
        }
    }
}

/* 侧边栏样式 */
.sidebar {
    width: 280px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e5e7eb;
    overflow: hidden;
    transition: width 0.3s ease; // 添加过渡效果

    // 移动端隐藏侧边栏，后续可通过按钮控制显示
    @media (max-width: 768px) {
        position: fixed; // 改为fixed，使其可以覆盖内容
        left: -280px; // 默认隐藏在左侧
        top: 0;
        bottom: 0;
        height: 100%;
        z-index: 200; // 比聊天输入框高，比可能的遮罩层低
        box-shadow: 2px 0 5px rgba(0,0,0,0.1);
        &.sidebar-open-mobile {
            left: 0; // 打开时滑入
        }
    }
    
    /* 侧边栏头部 */
    .sidebar-header {
        padding: 16px;
        
        .app-title {
            margin-bottom: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            
            .mac-controls {
                display: flex;
                gap: 8px;
                
                .mac-btn {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    cursor: default;
                }
                
                .mac-close {
                    background-color: #ff5f56;
                }
                
                .mac-minimize {
                    background-color: #ffbd2e;
                }
                
                .mac-expand {
                    background-color: #27c93f;
                }
            }
        }
        
        .search-input {
            margin-bottom: 16px;
            
            :deep(.el-input__wrapper) {
                background-color: #f5f5f5;
                border-radius: 8px;
                box-shadow: none;
                padding: 6px 12px;
            }
            
            :deep(.el-input__inner) {
                font-size: 14px;
            }
        }
        
        .new-chat-wrapper {
            .new-chat-btn {
                width: 100%;
                border-radius: 8px;
                background: #202123!important;
                border: none;
                padding: 10px 0;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                
                &:hover {
                    background-color: #353740;
                }
            }
        }
        
        /* 移动端功能按钮样式 */
        .mobile-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 16px;
            padding: 8px 0;
            border-top: 1px solid #f0f0f0;
            border-bottom: 1px solid #f0f0f0;
            
            [data-theme="dark"] & {
                border-color: #333;
            }
            
            .mobile-action-btn {
                flex: 1;
                padding: 8px;
                margin: 0 4px;
                border-radius: 8px;
                background-color: #f5f5f5;
                display: flex;
                align-items: center;
                justify-content: center;
                border: none;
                
                [data-theme="dark"] & {
                    background-color: #2d2d33;
                }
                
                &:hover {
                    background-color: #e8e8e8;
                    
                    [data-theme="dark"] & {
                        background-color: #383842;
                    }
                }
                
                .el-icon {
                    font-size: 16px;
                    color: #333;
                    
                    [data-theme="dark"] & {
                        color: #ddd;
                    }
                }
                
                &.theme-btn .el-icon {
                    color: #ffa500;
                }
                
                &.settings-btn .el-icon {
                    color: #4284f5;
                }
            }
        }
    }

    /* 侧边栏分组 */
    .saved-chats, .history-group {
        padding: 0 16px;
        
        .sidebar-label {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            color: #666;
            margin-bottom: 8px;
            
            .expand-icon {
                margin-left: auto;
                font-size: 12px;
                transition: transform 0.2s;
                
                &.collapsed {
                    transform: rotate(-90deg);
                }
            }
        }
    }
    
    .saved-chats {
        margin-bottom: 24px;
    }
}

/* 聊天项目 */
.chat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    transition: background-color 0.2s;
    margin-bottom: 4px;
    position: relative;
    
    .chat-icon {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        flex-shrink: 0;
    }
    
    .chat-title {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .more-btn {
        opacity: 0;
        transition: opacity 0.2s;
        padding: 2px;
        
        .el-icon {
            font-size: 16px;
            color: #666;
        }
    }
    
    &:hover {
        background-color: #f0f2f5;
        
        .more-btn {
            opacity: 1;
        }
    }
    
    &.active {
        background-color: #e6f4ff;
        color: #1677ff;
        font-weight: 500;
    }
}

/* 聊天头部 */
.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 24px;
    border-bottom: 1px solid #eaeaea;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
    position: relative;
    z-index: 10;
    
    // 暗黑模式
    [data-theme="dark"] & {
        background-color: #202123;
        border-bottom-color: #333;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    }

    // 移动端样式
    @media (max-width: 768px) {
        padding: 10px 12px;
        border: none;
        box-shadow: none;
    }

    // 移动端左侧按钮组
    .header-left-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 0 0 auto;
        .el-button.el-button--default.action-btn.theme-btn{
            margin-left: 0px;
            padding: 8px 10px;

            background-color: #f6f6f9;
            [data-theme="dark"] & {
                background-color: #2d2d33;
            }
        }
    }
    
    .mobile-menu-button {
        display: none; // 默认隐藏
        background-color: transparent;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        padding: 8px;
        transition: background-color 0.2s ease;
        
        @media (max-width: 768px) {
            display: flex; // 移动端显示
            align-items: center;
            justify-content: center;
        }
        
        &:hover {
            background-color: rgba(0, 0, 0, 0.05);
            
            [data-theme="dark"] & {
                background-color: rgba(255, 255, 255, 0.1);
            }
        }
        
        img {
            width: 24px;
            height: 24px;
            
            [data-theme="dark"] & {
                filter: invert(1); // 暗色模式下反转颜色
            }
        }
    }
    
    // 左侧区域
    .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
        
        // 移动端居中样式
        &.mobile-centered {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
        }
        
        .model-status {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: #666;
            
            [data-theme="dark"] & {
                color: #aaa;
            }
        }
        
        // Removing duplicate model-tag styles as they're now properly defined inside model-info
    }
    
    // 中间标题区域
    .header-center {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        max-width: 40%;
        text-align: center;
        
        .conversation-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            
            .conversation-title {
                font-size: 16px;
                font-weight: 600;
                color: #333;
                margin-bottom: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
                
                [data-theme="dark"] & {
                    color: #e0e0e0;
                }
            }
            
            .conversation-stats {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                color: #666;
                
                [data-theme="dark"] & {
                    color: #aaa;
                }
                
                .stats-item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    
                    .el-icon {
                        font-size: 12px;
                    }
                }
                
                .stats-divider {
                    color: #d1d5db;
                    
                    [data-theme="dark"] & {
                        color: #555;
                    }
                    margin-top: -2px;
                }
            }
        }
    }
    
    .model-info {
        display: flex;
        align-items: center;
        padding: 6px 10px;
        border-radius: 6px;
        transition: background-color 0.2s;
        background-color: #f9f9f9;
        
        [data-theme="dark"] & {
            background-color: #2d2d33;
        }
        
        &:hover {
            background-color: #f0f2f5;
            
            [data-theme="dark"] & {
                background-color: #383842;
            }
        }
        
        // 移动端样式
        @media (max-width: 768px) {
            padding: 4px 8px;
            min-width: 0;
            background-color: transparent;
            
            &:hover {
                background-color: transparent;
            }
        }
        
        .model-name {
            font-size: 15px;
            font-weight: 500;
            color: #333;
            
            [data-theme="dark"] & {
                color: #e0e0e0;
            }
            
            // 移动端样式 - 限制宽度防止超长
            @media (max-width: 768px) {
                font-size: 13px;
                max-width: 130px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        .el-tag.el-tag--success.el-tag--small.el-tag--dark.model-tag {
    background: transparent;
    color: black;
    border: none;
}
        .model-tag {
            margin-left: 8px;
            height: auto;
            padding: 2px 8px;
            font-size: 11px;
            
            @media (max-width: 768px) {
                padding: 2px 6px;
                font-size: 10px;
            }
            
            .tag-content {
                display: flex;
                align-items: center;
                gap: 4px;
                
                .status-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    
                    &.online {
                        background-color: #10b981;
                        box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
                        animation: pulse 2s infinite;
                    }
                }
            }
        }
        
        .model-dropdown-icon {
            margin-left: 6px;
            font-size: 12px;
            color: #909399;
            
            [data-theme="dark"] & {
                color: #aaa;
            }
            
            @media (max-width: 768px) {
                font-size: 10px;
                margin-left: 2px;
            }
        }
    }
    
    .header-actions {
        display: flex;
        gap: 8px;
        
        &.mobile-right-actions {
            flex: 0 0 auto;
            z-index: 2; // 确保按钮在模型信息上方可点击
        }
        
        .config-btn, .share-btn, .action-btn {
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
            background-color: transparent;
            border: 1px solid #0000003b;
            color: #333;
            margin-left: 0px;
            
            [data-theme="dark"] & {
                background-color: #2d2d33;
                border-color: #444;
                color: #e0e0e0;
            }
            
            &:hover {
                background-color: #f0f2f5;
                
                [data-theme="dark"] & {
                    background-color: #383842;
                }
            }
            
            .el-icon {
                font-size: 14px;
            }
        }

        .theme-btn {
            padding: 8px 8px;
            transition: transform 0.3s;
            
            &:hover {
                transform: rotate(15deg);
            }
            
            [data-theme="dark"] & .el-icon {
                color: #FFD43B;
            }
        }
        
        .action-btn[type="primary"] {
            background-color: #4284f5;
            border-color: #4284f5;
            color: white;
            
            &:hover {
                background-color: #3472dc;
                border-color: #3472dc;
            }
            
            [data-theme="dark"] & {
                background-color: #4284f5;
                border-color: #3470db;
            }
        }
        
        @media (max-width: 768px) {
            gap: 4px; // 减小按钮间距
            
            .config-btn, .share-btn, .action-btn {
                padding: 8px !important; // 减小内边距
                min-width: 36px !important; // 确保按钮不会太小
                margin-left: 0px;
                border: none;
                display:none;
                
                // 移动端隐藏按钮文字，只显示图标
                .button-text {
                    display: none;
                }
                
                // 调整图标大小
                .el-icon {
                    font-size: 16px;
                    margin: 0;
                }
            }
        }
    }
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
    }
    70% {
        box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
}

/* 消息区域 */
.messages-container {
    flex: 1; // 占据剩余空间
    overflow-y: auto;
    padding: 16px 8px 20px; // 底部留出一些空间，但主要由输入框高度决定
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center; // Center child items horizontally
    
    @media (max-width: 768px) {
        padding: 12px 8px 10px;
        align-items: stretch; // Full width on mobile
    }

    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: rgba(0,0,0,0.1);
        border-radius: 3px;
    }
    
    .empty-state {
        height: 100%;
        display: flex;
        justify-content: center;
        //padding-top: 80px;
    }
    
    /* 添加滚动到底部按钮样式 */
    .scroll-to-bottom-btn {
        position: absolute;
        bottom: 185px;
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: transparent;
        color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: none;
        border: none;
        outline: none;
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 100;
        
        &.visible {
            opacity: 1;
            visibility: visible;
            animation: bounce 1s ease infinite;
        }
        
        &:hover {
            color: rgba(0, 0, 0, 0.8);
            transform: translateX(-50%) translateY(-2px);
        }
        
        &:active {
            transform: translateX(-50%) translateY(0);
        }
        
        svg {
            width: 24px;
            height: 24px;
            filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.2));
        }
        
        @media (max-width: 768px) {
            bottom: 100px;
            right: 16px;
            left: auto;
            transform: none;
            width: 36px;
            height: 36px;
            
            &:hover {
                transform: translateY(-2px);
            }
            
            &:active {
                transform: translateY(0);
            }
            
            svg {
                width: 22px;
                height: 22px;
            }
        }
    }
    
    .welcome-container {
        text-align: center;
        max-width: 800px;
        
        // 移动端欢迎页适配
        @media (max-width: 768px) {
            padding: 20px 10px;
            .welcome-title {
                font-size: 28px;
            }
            .welcome-subtitle {
                font-size: 14px;
            }
            .task-cards,
            .quick-actions {
                gap: 8px;
            }
        }
        
        .welcome-avatar {
            background-color: #4284f5;
            font-size: 40px;
            margin-bottom: 24px;
        }
        
        .welcome-title {
            font-size: 36px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #333;
        }
        
        .welcome-subtitle {
            font-size: 16px;
            color: #666;
            margin-bottom: 40px;
        }
        
        /* 任务卡片样式 */
        .task-cards {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            margin-bottom: 40px;
            
            .task-card, .task-suggestions, .prompt-suggestion {
                flex: 1;
                min-width: 260px;
                background-color: #fafafa;
                border-radius: 12px;
                padding: 16px;
                text-align: left;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                 @media (max-width: 768px) {
                    min-width: calc(50% - 4px); // 移动端一行两个
                    padding: 12px;
                }
            }
            
            .task-card {
                background-color: #202123;
                color: white;
                display: flex;
                gap: 12px;
                
                .task-card-content {
                    .task-card-header {
                        font-weight: 600;
                        margin-bottom: 6px;
                    }
                    
                    .task-card-description {
                        font-size: 13px;
                        opacity: 0.8;
                        line-height: 1.4;
                    }
                }
            }
            
            .task-suggestions {
                display: flex;
                flex-direction: column;
                
                .task-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 0;
                    border-bottom: 1px solid #f0f0f0;
                    font-size: 14px;
                    color: #333;
                    
                    .el-icon {
                        color: #666;
                    }
                    
                    &:last-child {
                        border-bottom: none;
                    }
                }
                
                .task-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 12px;
                    
                    span {
                        font-size: 13px;
                        color: #666;
                    }
                }
            }
            
            .prompt-suggestion {
                .prompt-header {
                    display: flex;
                    
                    .prompt-text {
                        flex: 1;
                        font-size: 14px;
                        line-height: 1.5;
                        color: #333;
                    }
                    
                    .prompt-more {
                        color: #999;
                    }
                }
                
                .prompt-footer {
                    margin-top: 16px;
                    font-size: 13px;
                    color: #666;
                }
            }
        }
        
        /* 快速操作按钮 */
        .quick-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            justify-content: center;
            margin-top: 40px;
            
            .action-button {
                border-radius: 20px;
                padding: 8px 16px;
                background-color: #f5f5f7;
                border: none;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                
                &:hover {
                    background-color: #eaeaec;
                }
                
                .el-icon {
                    font-size: 16px;
                    color: #666;
                }
                 @media (max-width: 768px) {
                    font-size: 12px;
                    padding: 6px 12px;
                }
            }
        }
    }
}

/* 添加动画效果 */
@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-5px);
    }
}

/* 聊天输入框 */
.modern-chat-input {
    // 这个类现在主要由 ChatInput.vue 内部控制样式
    // 在 ChatView.vue 中，它会自然地填充 .main-chat-area 的宽度
    // 但我们还是给它一个基本的下边距，尤其是在没有其他内容撑开时
    margin-bottom: 10px; 
    padding-left: 10px; // 左右留一些边距，使其不紧贴边缘
    padding-right: 10px;

    [data-theme="dark"] & {
      // 确保在暗黑模式下，如果 ChatInput.vue 没有设置背景，这里不会有冲突
    }
    
    @media (max-width: 768px) {
        margin-bottom: 0; // 移动端底部通常没有额外边距
        padding-left: 5px;
        padding-right: 5px;
    }
}

/* 免责声明 */
.disclaimer {
    text-align: center;
    font-size: 12px;
    color: #888;
    padding: 12px;
    margin-bottom: 80px;
}

/* 设置对话框样式 */
:deep(.settings-dialog) {
    border-radius: 12px;
    overflow: hidden;
    
    .el-dialog__header {
        padding: 20px;
        margin: 0;
        border-bottom: 1px solid #f0f2f5;
        
        .el-dialog__title {
            font-size: 18px;
            font-weight: 600;
            margin-left: 40%;
        }
    }
    
    .el-dialog__body {
        padding: 24px;
        max-height: 60vh;
        overflow-y: auto;
        .el-divider__text.is-left{
        left: 25%;
        }
        
        &::-webkit-scrollbar {
            width: 1px;
        }
        scrollbar-width: auto;
        
        &::-webkit-scrollbar-track {
            background: transparent;
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: rgba(0,0,0,0.1);
            border-radius: 3px;
        }
    }
    
    .el-dialog__footer {
        padding: 16px 20px;
        border-top: 1px solid #f0f2f5;
    }
    
    .settings-form {
        .el-divider {
            margin: 20px 0 16px;
        }
        
        :deep(.el-form-item) {
            margin-bottom: 16px;
        }
        
        :deep(.el-form-item__label) {
            font-size: 14px;
            color: #555;
        }
        
        .form-item-tip {
            font-size: 12px;
            color: #999;
            margin-top: 4px;
            line-height: 1.4;
        }
        
        .w-full {
            width: 100%;
        }
        
        .current-role-info {
            padding: 12px;
            border-radius: 8px;
            background-color: #f9f9f9;
            
            .role-name {
                font-weight: 600;
                margin-bottom: 6px;
                color: #333;
            }
            
            .role-prompt {
                font-size: 12px;
                color: #666;
                margin-bottom: 8px;
                white-space: pre-wrap;
                line-height: 1.5;
                max-height: 100px;
                overflow-y: auto;
                scrollbar-width: none;
            }
        }
        
        .custom-model-input {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            
            .custom-model-field {
                flex: 1;
            }
        }
        
        .custom-models-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
            
            .custom-model-tag {
                margin-bottom: 4px;
                background-color: #f0f7ff;
                border-color: #d0e3ff;
                color: #4284f5;
                font-size: 12px;
                padding: 0 8px;
                height: 28px;
                line-height: 26px;
                transition: all 0.3s;
                
                .el-tag__close {
                    color: #4284f5;
                    
                    &:hover {
                        background-color: #4284f5;
                        color: white;
                    }
                }
                
                &:hover {
                    border-color: #4284f5;
                }
                
                [data-theme="dark"] & {
                    background-color: #2d3748;
                    border-color: #4a5568;
                    color: #90cdf4;
                }
            }
        }
    }
    
    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }
}

/* 为随机颜色生成函数 */
@function getRandomColor($id) {
    $colors: (
        #4284f5, #34a853, #fdbc40, #ed5a5a, #8150e4, 
        #f07922, #0097a7, #d32f2f, #039be5, #7cb342
    );
    @return nth($colors, ($id % 10) + 1);
}

/* 暗色模式调整 */
[data-theme="dark"] {
    .chat-view-container {
        background-color: #1a1a1a;
    }
    
    .sidebar {
        background-color: #202123;
        border-color: #333;
        
        .sidebar-header {
            .app-title {
                color: #fff;
                
                .mac-btn {
                    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1) inset;
                }
            }
            
            .search-input {
                :deep(.el-input__wrapper) {
                    background-color: #2d2d33;
                }
                
                :deep(.el-input__inner) {
                    color: #ddd;
                }
            }
        }
        
        .sidebar-label {
            color: #aaa;
        }
    }
    
    .chat-item {
        color: #ddd;
        
        &:hover {
            background-color: #2d2d33;
        }
        
        &.active {
            background-color: #2d2d33;
            color: #4284f5;
        }
        
        .more-btn .el-icon {
            color: #aaa;
        }
    }
    
    .main-chat-area {
        background-color: #1a1a1a;
    }
    
    .chat-header {
        background-color: #202123;
        border-color: #333;
     
        .model-info .model-name {
            color: #ddd;
          
        }
        
        .header-actions {
            .config-btn, .share-btn, .action-btn {
                background-color: #2d2d33;
                border-color: #444;
                color: #ddd;
                
                &:hover {
                    background-color: #353740;
                }
            }
        }
    }
    
    .messages-container {
        .welcome-container {
            padding-top:0px;
            .welcome-title {
                color: #ddd;
            }
            
            .welcome-subtitle {
                color: #aaa;
            }
            
            .task-suggestions {
                background-color: #2d2d33;
                
                .task-item {
                    border-color: #444;
                    color: #ddd;
                    
                    .el-icon {
                        color: #aaa;
                    }
                }
                
                .task-footer span {
                    color: #aaa;
                }
            }
            
            .prompt-suggestion {
                background-color: #2d2d33;
                
                .prompt-header .prompt-text {
                    color: #ddd;
                }
                
                .prompt-footer {
                    color: #aaa;
                }
            }
            
            .quick-actions .action-button {
                background-color: #2d2d33;
                color: #ddd;
                
                &:hover {
                    background-color: #353740;
                }
                
                .el-icon {
                    color: #aaa;
                }
            }
        }
        
        .scroll-to-bottom-btn {
            background-color: transparent;
            color: rgba(255, 255, 255, 0.6);
            border: none;
            outline: none;
            box-shadow: none;
            
            &:hover {
                color: rgba(255, 255, 255, 0.9);
                background-color: transparent;
            }
            
            svg {
                filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.3));
            }
        }
    }
    
    .modern-chat-input {
        background-color: transparent;
    }
    
    .disclaimer {
        color: #777;
    }
    
    :deep(.settings-dialog) {
        background-color: #202123;
        
        .el-dialog__header {
            border-color: #333;
        }
        
        .el-dialog__footer {
            border-color: #333;
        }
        
        .settings-form {
            :deep(.el-form-item__label) {
                color: #aaa;
            }
            
            .form-item-tip {
                color: #777;
            }
            
            .current-role-info {
                background-color: #2d2d33;
                
                .role-name {
                    color: #ddd;
                }
                
                .role-prompt {
                    color: #aaa;
                }
            }
        }
    }
}

// 在适当位置添加深度思考的样式
:deep(.chat-message) {
    .reasoning-content {
        margin-top: 12px;
        padding: 12px 16px;
        background-color: #f5f5f5;
        border-radius: 8px;
        position: relative;
        
        .reasoning-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            font-weight: 500;
            color: #666;
            
            .reasoning-icon {
                color: #4284f5;
             
            }
        }
        
        .reasoning-text {
            font-size: 14px;
            line-height: 1.6;
            color: #666;
            white-space: pre-wrap;
        }
    }
}

:deep(.el-dropdown-menu) {
    .el-dropdown-item.is-active {
        color: #4284f5;
        background-color: #ecf5ff;
    }
    
    [data-theme="dark"] & .el-dropdown-item.is-active {
        color: #4284f5;
        background-color: #2d2d33;
    }
}

.parse-models-btn {
    margin-top: 8px;
    width: 100%;
}

/* 返回顶部按钮 */
.scroll-to-top {
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 100;

  &.visible {
    opacity: 1;
    visibility: visible;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }

  svg {
    width: 24px;
    height: 24px;
  }
}

// Add the custom model styles in the correct location - at the beginning of the style section
.custom-model-input {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    
    .custom-model-field {
        flex: 1;
    }
}

.custom-models-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
    
    .custom-model-tag {
        margin-bottom: 4px;
    }
  svg {
    width: 24px;
    height: 24px;
  }
}
</style>
<!-- <script>
document.querySelector('.toggle-thinking-btn').addEventListener('click', function() {
    var thinkingHeader = document.getElementById('thinking-header');
    thinkingHeader.style.backgroundColor = 'lightblue';  // 修改颜色
  });
</script>    -->
<!-- <script>
document.querySelector('.toggle-thinking-btn').addEventListener('click', function() {
    var thinkingHeader = document.getElementById('thinking-header');
    thinkingHeader.style.backgroundColor = 'lightblue';  // 修改颜色
  });
</script>    -->
  

