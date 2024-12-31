Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  # Defines the root path route ("/")
  devise_for :users
  root to: "home#index"
  
  resources :outdoor_sessions, only: [:create, :new, :edit, :update]
  resources :challenges, only: [:show]

  post 'set_time_zone', to: 'time_zones#set_time_zone'

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  
  # get 'home/index'
end
