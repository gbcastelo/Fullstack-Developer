# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

admin = User.find_or_create_by!(email_address: "admin@umanni.test") do |u|
  u.full_name = "Admin User"
  u.password = "password123"
  u.role = :admin
end

3.times do |i|
  User.find_or_create_by!(email_address: "user#{i + 1}@umanni.test") do |u|
    u.full_name = "Sample User #{i + 1}"
    u.password = "password123"
    u.role = :user
  end
end

puts "Seeded #{User.count} users (admin: #{admin.email_address} / password123)."
