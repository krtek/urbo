//  Created by Jesse MacFadyen on 10-05-29.
//  Copyright 2010 Nitobi. All rights reserved.
//  Copyright 2012, Randy McMillan
// Continued maintainance @RandyMcMillan 2010/2011/2012

#import <Foundation/Foundation.h>
#import <CORDOVA/CDVPlugin.h>
#import "ChildBrowserViewController.h"


@interface ChildBrowserCommand : CDVPlugin <ChildBrowserDelegate>  {
	ChildBrowserViewController* childBrowser;
}

@property (nonatomic, retain) ChildBrowserViewController *childBrowser;


- (void) showWebPage:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void) onChildLocationChange:(NSString*)newLoc;

@end
