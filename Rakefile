# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

if [[], ["test"]].include?(ARGV)
  # do not load the whole env just to exec tests + prevent ENV overloading
  require "rake/testtask"
  Rake::TestTask.new do |t|
    t.pattern = "test/**/*_{spec,test}.rb"
    t.warning = false
  end
  task default: :test
else
  require File.expand_path('../config/application', __FILE__)
  Rails.application.load_tasks
end

desc 'Scan for brakeman vulnerabilities'
task :brakeman do
  sh "brakeman --exit-on-warn --table-width 999"
end
