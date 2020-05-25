#!/usr/bin/env node

const program = require('commander')
const tasks = require('../tasks')

// 将解析后的参数赋值给args
program.parse(process.argv)

const task = program.args[0]

const runTask = async (name) => {
  const taskInstance = tasks[name]

  if (!taskInstance) {
    console.log('task not found')
    return
  }
  
  console.log(`[${task}] start ......`)
  taskInstance({
    success: () => console.log(`[${task}] excuted success`),
    failed: () => console.log(`[${task}] excuted failed`)
  })

}

if (!task) {
  program.help()
} else {
  console.log('ccui-tools run', task)

  runTask(task)
}