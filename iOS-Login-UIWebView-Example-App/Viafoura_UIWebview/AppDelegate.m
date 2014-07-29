//
//  V4AAppDelegate.m
//  Viafoura_UIWebview
//
//  Created by Demetrios Kallergis on 2014-04-28.
//  Copyright (c) 2014 Viafoura. All rights reserved.
//

#import "AppDelegate.h"
#import "WebViewController.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    
    self.window.backgroundColor = [UIColor whiteColor];
    [self.window makeKeyAndVisible];
    
    WebViewController *wvc = [[WebViewController alloc] initWithNibName:@"WebViewController" bundle:nil];
    
    self.window.rootViewController = wvc;

    return YES;
}


@end
