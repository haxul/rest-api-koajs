# Task-manager
Rest API backed by Koa.js and MariaDB

Entities: 
1.Accout(email(varchar), password(varchar),tasksProcessing(oneToMany), tasksDone(oneToMany), tasksToProcess(oneToMany))
2.Auth (accessToken(varchar), accountId(foreign key to accoutn), created(timestamp))
3.TaskDone(accoutnId(foreign key to account), id, value)
4.TaskProcessing(accoutnId(foreign key to account), id, value)
5.TaskToProcess(accoutnId(foreign key to account), id, value)

Algoritm:
1.registrations 
  1.1.validate input forms. If it is not ok throw error 400 else
  1.2.the user is wroten in db
2.Authorization
  2.1. process fields the user passes. Here I mean to check entity. If it is appropriate or not?
  2.2. It is ok generate token and give it to the user. If the form is not correct throw error 422
  2.3 Father before the user gets data from the server he must show your access token. Otherwise access is denied for him.
3.Write three queris to get, update, create and remove tasks from sql tables by user id
