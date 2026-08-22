module.exports = {
  packagerConfig: {
    icon: 'icon.ico',
    name: 'Minecraft指令生成器',
    executableName: 'Minecraft指令生成器',
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {
        name: 'MinecraftCommandGenerator',
        setupExe: 'Minecraft指令生成器-Setup.exe',
        setupIcon: 'icon.ico',
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
      config: {
        arch: ['x64']
      }
    }
  ]
};  