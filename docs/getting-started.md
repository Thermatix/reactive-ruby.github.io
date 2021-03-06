---
id: getting-started
title: Getting Started
next: tutorial.html
redirect_from: "docs/index.html"
---

## Opal Playground

A great way to start learning React.rb is use OpalPlayground.

Here is a simple HelloWorld example to get you started.

**[HelloWorld](http://fkchang.github.io/opal-playground/?code:class%20HelloWorld%20%3C%20React%3A%3AComponent%3A%3ABase%0A%20%20param%20%3Avisitor%0A%0A%20%20def%20render%0A%20%20%20%20%22Hello%20there%20%23%7Bparams.visitor%7D%22%0A%20%20end%0Aend%0A%0A%0AElement%5B%27%23content%27%5D.render%20do%0A%20%20HelloWorld%20visitor%3A%20%22world%22%0Aend%0A%0A%0A&html_code=%3Cdiv%20id%3D%27content%27%3E%3C%2Fdiv%3E&css_code=body%20%7B%0A%20%20background%3A%20%23eeeeee%3B%0A%7D%0A)**

## Using Inline-Reactive-Ruby

For small static sites that don't need a server backend you can use the Inline-Reactive-Ruby javascript library.
Simply include the inline-reactive-ruby.js file with your other javascript code, or access it directly via the CDN, and you are good to go.

This is another great way to experiment with React.rb.  You don't need any setup or download to get started.

[Inline-Reactive-Ruby](https://github.com/reactive-ruby/inline-reactive-ruby)

## With Rails

React.rb works great with new or existing rails apps, and React.rb plays well with other frameworks, so
its pain free to introduce React to your application.

Within a Rails app React Components are treated as `Views`, and by convention you will place your components
in the app/views/components directory.

Your Rails controllers, and layouts access your top level components using the `render_component` method.

During server-side-rendering your components will be called on to generate the resulting HTML just like ERB or
HAML templates.  The resulting HTML is delivered to the client like any other rails view, but in addition all
the code needed to keep the component dynamically updating is delivered as well.  So now as events occur on the
client the code is re-rendered client side with no server action required.

Because React plays well with others, you can start with a single aspect of a page or layout
(a dynamic chat widget for example) and add a React component to implement that functionality.

To start using React.rb within a new or existing rails 4.0 app, follow these steps:

#### Add the gems

In your Gemfile:

```ruby
gem 'reactive-ruby'
gem 'react-rails', '~> 1.3.0'
gem 'opal-rails'
gem 'therubyracer', platforms: :ruby # Required for prerendering
# optional gems
gem 'opal-jquery'     # a clean interface to jQuery from your ruby code
gem 'reactive-router' # a basic SPA router
```

Run `bundle install` and restart your rails server.

#### Add the components directory and manifest

Your react components will go into the `app/views/components/` directory of your
rails app.

Within your `app/views` directory you need to create a `components.rb` manifest.
Files required in `app/views/components.rb` will be made available to the server
side rendering system as well as the browser.

```
# app/views/components.rb
require 'opal'
require 'reactive-ruby'
require 'reactive-router' # if you are using the reactive-router gem
require_tree './components'
```

#### Client Side Assets

Typically the client will need all the above assets, plus other files that are client only.
Notably jQuery is a client only asset.

You can update your existing application.js file, or convert it to ruby syntax and name
it application.rb.  The below assumes you are using ruby syntax.

In `assets/javascript/application.rb` require your components manifest as well
as any additional browser only assets.

```
# assets/javascript/application.rb

# Make components available by requiring your components.rb manifest.
require 'components'

# 'react_ujs' tells react in the browser to mount rendered components.
require 'react_ujs'

# Finally, require your other javascript assets. jQuery for example...
require 'jquery'      # You need both these files to access jQuery from Opal.
require 'opal-jquery' # They must be in this order.
```

#### Rendering Components

Components may be rendered directly from a controller action by simply following
a naming convention. To render a component from the `home#show` action, create a
component class named `Show`.

```ruby
# app/views/components/home/show.rb
module Components
  module Home
    class Show < React::Component::Base

      param :say_hello_to

      def render
        puts "Rendering my first component!"
        "hello #{params.say_hello_to if params.say_hello_to}"
      end
    end
  end
end
```

To render the component call `render_component` in the controller action passing along any params:

```ruby
# controllers/home_controller.rb
class HomeController < ApplicationController
  def show
    # render_component uses the controller name to find the 'show' component.
    render_component say_hello_to: params[:say_hello_to]
  end
end
```

Make sure your routes file has a route to your home#show action. Visit that
route in your browser and you should see 'Hello' rendered.

Open up the js console in the browser and you will see a log showing what went
on during rendering.

Have a look at the sources in the console, and notice your ruby code is there,
and you can set break points etc.

## With Sinatra

React.rb works fine with Sinatra.  Use this [Sinatra Example App](https://github.com/zetachang/react.rb/tree/master/example/sinatra-tutorial)
to get started.

## Building With Rake

If you have a larger static app (like this one) you will want to precompile your ruby code to a single js file, instead of using inline-reactive-ruby. *You will need
a basic ruby setup (you can follow instructions for Jekyll for example.)*

The following assumes you are building a js file called application.js, and the code is stored in a directory
called react_lib.

Add the following gems, and run bundle install.

```ruby
# Gemfile
gem 'opal'
gem 'opal-browser' # optional
gem 'reactive-ruby'
gem 'opal-jquery'  # optional
```

Your rake file task will look like this:

```ruby
#rake.rb
desc "Build react.rb library"
task :build_react_lib do
  Opal.append_path "react_lib"
  File.binwrite "react_lib.js", Opal::Builder.build("application").to_s
end
```

Your main application file will look like this:

```ruby
#react_lib/application.rb

require 'opal'
require 'browser/interval' # optional
require 'browser/delay'    # optional
# you can pull in the jQuery.js file here, or separately
# but in must be loaded BEFORE opal-jquery
require 'opal-jquery'      # optional
require 'reactive-ruby'
# here you can require other files, do a require_tree, or
# just add some components inline right here...
class Clock < React::Component::Base

  after_mount do
    every(1) { force_update! }
  end

  def render
    "Hello there - Its #{Time.now}"
  end
end

Document.ready? do
  Element['#content'].render{ Clock() }
end
```

Run `bundle exec rake build_react_app`

This should build `react_lib.js` which can be included in your main html file.


## Next Steps

Check out [the tutorial](/docs/tutorial.html) to learn more.

Good luck, and welcome!
