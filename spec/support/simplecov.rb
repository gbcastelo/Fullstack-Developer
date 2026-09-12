require "simplecov"
SimpleCov.command_name "rspec_#{ENV['TEST_ENV_NUMBER'] || 1}"
SimpleCov.start "rails" do
  skip "/spec/"
  skip "/config/"
  # Inert Rails generator scaffolding: never referenced by any controller,
  # model, job, or mailer in this app (no ActionCable, ActiveJob, or
  # ActionMailer usage exists), so there's nothing meaningful to test here.
  skip "app/channels/application_cable/connection.rb"
  skip "app/jobs/application_job.rb"
  skip "app/mailers/application_mailer.rb"
  minimum_coverage 90
end
